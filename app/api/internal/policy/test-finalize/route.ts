// app/api/internal/policy/test-finalize/route.ts
import { NextResponse } from "next/server";
import { finalizePolicy } from "@/lib/policy/finalize";
import type { PolicyFinalizeInput } from "@/lib/policy/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal dev endpoint:
 * - POST with optional partial overrides
 * - Generates a PAID "test" payment and finalizes a policy (idempotent)
 *
 * Usage (example):
 * fetch("/api/internal/policy/test-finalize", { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ vrm:"MD15UOA" }) })
 */
export async function POST(req: Request) {
  try {
    const overrides = (await req.json().catch(() => ({}))) as Partial<PolicyFinalizeInput>;

    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60 * 1000); // +5 mins
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const payload: PolicyFinalizeInput = {
      // Quote
      vrm: overrides.vrm ?? "MD15UOA",
      make: overrides.make ?? "Ford",
      model: overrides.model ?? "Fiesta",
      year: overrides.year ?? "2015",
      startAt: overrides.startAt ?? start.toISOString(),
      endAt: overrides.endAt ?? end.toISOString(),
      durationMs: overrides.durationMs ?? end.getTime() - start.getTime(),
      totalAmountPence: overrides.totalAmountPence ?? 199 * 2, // example only

      // Customer
      fullName: overrides.fullName ?? "Test Customer",
      dob: overrides.dob ?? "1995-01-01",
      email: overrides.email ?? "test@example.com",
      licenceType: overrides.licenceType ?? "UK",
      address: overrides.address ?? "1 Test Street, London, SW1A 1AA",

      // Payment (provider-agnostic)
      paymentProvider: overrides.paymentProvider ?? "test",
      paymentId: overrides.paymentId ?? `test_${Date.now()}`,
      paymentStatus: overrides.paymentStatus ?? "PAID",
      currency: overrides.currency ?? "GBP",
    };

    const result = await finalizePolicy(payload);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Test finalize failed", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
