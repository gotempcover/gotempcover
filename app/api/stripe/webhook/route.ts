// app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { finalizePolicy } from "@/lib/policy/finalize";
import { fulfillPolicy } from "@/lib/policy/fulfill";

export const runtime = "nodejs";

// Tighten licenceType to your allowed set (fallback to UK)
function coerceLicenceType(v: unknown): "UK" | "International" | "Learner" {
  const s = String(v ?? "").trim();
  if (s === "International") return "International";
  if (s === "Learner") return "Learner";
  return "UK";
}

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Pin to your Stripe dashboard API version (fixes TS + keeps stable behavior)
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    });

    // Stripe signature verification requires RAW body
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message ?? String(err)}` },
        { status: 400 }
      );
    }

    console.log("[stripe webhook]", event.type);

    // ✅ STRICT RULE: only handle checkout.session.completed
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Optional refinement: session context log (helps debug without noise)
    console.log("[stripe webhook] session", {
      id: session.id,
      payment_status: session.payment_status,
    });

    // ✅ STRICT RULE: only finalize when paid
    if (session.payment_status !== "paid") {
      console.log("[stripe webhook] ignoring unpaid session", {
        id: session.id,
        payment_status: session.payment_status,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const md = session.metadata || {};

    // Hard guard: you should ALWAYS have vrm/startAt/endAt/email/etc in metadata
    if (!md.vrm || !md.startAt || !md.endAt || !(md.email || session.customer_email)) {
      console.error("[stripe webhook] missing required metadata", {
        id: session.id,
        metadataKeys: Object.keys(md),
        customer_email: session.customer_email,
      });
      return NextResponse.json(
        { error: "Missing required metadata on session" },
        { status: 400 }
      );
    }

    // 1) Finalize policy in DB (idempotent)
    // (Optional refinement) because Policy has @@unique([paymentProvider, paymentId]),
    // finalizePolicy will already be safe for retries. We keep calling finalizePolicy,
    // which returns the existing row if it already exists.
    const result = await finalizePolicy({
      // quote
      vrm: md.vrm || "",
      make: md.make || null,
      model: md.model || null,
      year: md.year || null,
      startAt: md.startAt || "",
      endAt: md.endAt || "",
      durationMs: Number(md.durationMs || 0),
      totalAmountPence: Number(md.totalAmountPence || 0),

      // customer
      fullName: md.fullName || "",
      dob: md.dob || "",
      email: md.email || session.customer_email || "",
      licenceType: coerceLicenceType(md.licenceType),
      address: md.address || "",

      // payment (enums)
      paymentProvider: "STRIPE",
      paymentId: session.id,
      paymentStatus: "PAID",
      currency: (session.currency || "gbp").toUpperCase(),

      // stripe extra
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    });

    console.log("[finalize] ok", result.policyNumber);

    // 2) Generate + upload docs (should be idempotent-ish)
    try {
      const fulfilled = await fulfillPolicy(result.policyId);
      console.log("[fulfill] ok", fulfilled.policyNumber);
      console.log("[email] attempted (idempotent)");
    } catch (e: any) {
      // Important: still return 200 to Stripe to avoid endless retries.
      console.error(
        "[docs] fulfill failed (returning 200 to prevent retries)",
        e?.message ?? e
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    console.error("[stripe webhook] error", e);
    return NextResponse.json(
      { error: e?.message ?? "Webhook error" },
      { status: 500 }
    );
  }
}
