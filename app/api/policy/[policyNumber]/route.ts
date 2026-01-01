// app/api/policy/[policyNumber]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { policyNumber: string } }
) {
  try {
    const policyNumber = String(params.policyNumber || "").trim().toUpperCase();
    if (!policyNumber) {
      return NextResponse.json({ ok: false, error: "Missing policyNumber" }, { status: 400 });
    }

    const policy = await prisma.policy.findUnique({
      where: { policyNumber },
      include: {
        documents: true,
        events: { orderBy: { createdAt: "desc" }, take: 25 },
      },
    });

    if (!policy) {
      return NextResponse.json({ ok: false, error: "Policy not found" }, { status: 404 });
    }

    // For now we return everything (dev).
    // Later: redact DOB/address depending on auth rules.
    return NextResponse.json({ ok: true, policy });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Failed to load policy", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
