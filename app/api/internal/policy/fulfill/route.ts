import { NextResponse } from "next/server";
import { fulfillPolicy } from "@/lib/policy/fulfill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // same internal guard pattern
    const key = req.headers.get("x-internal-key");
    if (!process.env.INTERNAL_RENDER_KEY || key !== process.env.INTERNAL_RENDER_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as { policyId?: string } | null;
    if (!body?.policyId) {
      return NextResponse.json({ ok: false, error: "policyId is required" }, { status: 400 });
    }

    const result = await fulfillPolicy(body.policyId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "fulfill failed" },
      { status: 500 }
    );
  }
}
