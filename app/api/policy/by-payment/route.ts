import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import type { PaymentProvider } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/policy/by-payment?provider=stripe&id=cs_... (Stripe Checkout Session ID)
function coerceProvider(v: string | null): PaymentProvider | null {
  const s = (v || "").trim().toUpperCase();
  if (s === "STRIPE") return "STRIPE";
  return null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const paymentId = (url.searchParams.get("id") || "").trim();
    if (!paymentId) {
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 }
      );
    }

    const provider = coerceProvider(url.searchParams.get("provider")) ?? "STRIPE";

    const policy = await prisma.policy.findFirst({
      where: { paymentProvider: provider, paymentId },
      select: {
        id: true,
        policyNumber: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    if (!policy) {
      return NextResponse.json({ ok: true, found: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, found: true, policy });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Lookup failed", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
