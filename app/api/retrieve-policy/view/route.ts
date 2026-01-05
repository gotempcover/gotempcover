import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  policyNumber?: string;
  email?: string;
};

function normEmail(v: string) {
  return v.trim().toLowerCase();
}

function normPolicyNumber(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body?.policyNumber || !body?.email) {
      return NextResponse.json(
        { ok: false, error: "Missing policyNumber or email" },
        { status: 400 }
      );
    }

    const policyNumber = normPolicyNumber(body.policyNumber);
    const email = normEmail(body.email);

    const policy = await prisma.policy.findUnique({
      where: { policyNumber },
      select: {
        id: true,
        policyNumber: true,
        email: true,
        vrm: true,
        make: true,
        model: true,
        year: true,
        startAt: true,
        endAt: true,
        documents: {
          select: { kind: true, storageKey: true, url: true },
        },
      },
    });

    // Avoid leakage: generic OK=false (not "not found")
    if (!policy) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    if (normEmail(policy.email) !== email) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const cert = policy.documents.find((d) => d.kind === "CERTIFICATE");
    if (!cert) {
      return NextResponse.json(
        { ok: false, reason: "DOCS_NOT_READY" },
        { status: 200 }
      );
    }

    // Prefer signed URL via storageKey. Fallback to public url if you must.
    let certificateUrl: string | null = null;

    if (cert.storageKey) {
      const supabaseAdmin = getSupabaseAdmin();

      const { data, error } = await supabaseAdmin.storage
        .from("policy-documents")
        .createSignedUrl(cert.storageKey, 60 * 10); // 10 minutes

      if (error) {
        // Don't leak details
        return NextResponse.json({ ok: false }, { status: 200 });
      }

      certificateUrl = data.signedUrl;
    } else if (cert.url) {
      // Not ideal (public), but works if storageKey missing
      certificateUrl = cert.url;
    }

    if (!certificateUrl) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        ok: true,
        certificateUrl,
        policy: {
          policyNumber: policy.policyNumber,
          vrm: policy.vrm,
          make: policy.make,
          model: policy.model,
          year: policy.year,
          startAt: policy.startAt,
          endAt: policy.endAt,
        },
      },
      { status: 200 }
    );
  } catch {
    // Generic response to avoid leakage
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
