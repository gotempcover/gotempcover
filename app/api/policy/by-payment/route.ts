import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/policy/by-payment?provider=stripe&id=pi_123
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const provider = (url.searchParams.get("provider") || "").trim();
    const paymentId = (url.searchParams.get("id") || "").trim();

    if (!provider || !paymentId) {
      return NextResponse.json(
        { ok: false, error: "Missing provider or id" },
        { status: 400 }
      );
    }

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
      return NextResponse.json({ ok: false, found: false }, { status: 404 });
    }

    return NextResponse.json({ ok: true, found: true, policy });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Lookup failed", message: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
