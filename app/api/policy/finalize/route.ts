// app/api/policy/finalize/route.ts
import { NextResponse } from "next/server";
import { finalizePolicy } from "@/lib/policy/finalize";
import type { PolicyFinalizeInput } from "@/lib/policy/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as PolicyFinalizeInput | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    // Temporary guard: only allow finalize if paymentStatus looks paid
    // Later, Stripe/BTCPay webhooks will call this server-to-server.
    const paid = String(body.paymentStatus).toUpperCase() === "PAID";
    if (!paid) {
      return NextResponse.json(
        { ok: false, error: "Payment not confirmed" },
        { status: 402 }
      );
    }

    const result = await finalizePolicy(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Finalize failed", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
