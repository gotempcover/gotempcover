// app/api/policy/[policyNumber]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Next.js 16: params is a Promise for dynamic route handlers
type Ctx = { params: Promise<{ policyNumber: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { policyNumber } = await params;

    const cleaned = String(policyNumber || "").trim().toUpperCase();
    if (!cleaned) {
      return NextResponse.json({ ok: false, error: "Missing policyNumber" }, { status: 400 });
    }

    const policy = await prisma.policy.findUnique({
      where: { policyNumber: cleaned },
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
