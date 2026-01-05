import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { sendPolicyEmail } from "@/lib/email/sendPolicyEmail";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  policyNumber?: string;
  email?: string;

  // optional: if you want to allow "preview only" without emailing
  // mode?: "email" | "preview" | "both";
};

function normEmail(v: string) {
  return v.trim().toLowerCase();
}

function normPolicyNumber(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "");
}

async function getSignedOrPublicUrl(storageKey?: string | null, publicUrl?: string | null) {
  // Prefer signed url (better security)
  if (storageKey) {
    const { data, error } = await supabaseAdmin.storage
      .from("policy-documents")
      .createSignedUrl(storageKey, 60 * 10); // 10 minutes

    if (!error && data?.signedUrl) return data.signedUrl;
  }

  // Fallback (less secure) if you only have publicUrl
  if (publicUrl) return publicUrl;

  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body?.policyNumber || !body?.email) {
      return NextResponse.json({ error: "Missing policyNumber or email" }, { status: 400 });
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
          select: { kind: true, url: true, storageKey: true },
        },
      },
    });

    // Avoid leaking whether a policy exists
    if (!policy) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Confirm email matches (case-insensitive)
    if (normEmail(policy.email) !== email) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Grab docs
    const cert = policy.documents.find((d) => d.kind === "CERTIFICATE") ?? null;
    const prop = policy.documents.find((d) => d.kind === "PROPOSAL") ?? null;

    // If docs not present yet, still respond OK
    if (!cert?.url && !cert?.storageKey) {
      await prisma.policyEvent.create({
        data: {
          policyId: policy.id,
          type: "EMAIL_SENT",
          data: { ok: false, reason: "DOCS_NOT_READY" },
        },
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const certificateUrl = await getSignedOrPublicUrl(cert?.storageKey, cert?.url);
    const proposalUrl = await getSignedOrPublicUrl(prop?.storageKey, prop?.url);

    // Resend email (attachments)
    // If proposalUrl is missing for any reason, we still email certificate+whatever we can.
    // (If you want to require BOTH, you can hard-guard here.)
    await sendPolicyEmail({
      to: policy.email,
      policyNumber: policy.policyNumber,
      certificateUrl: certificateUrl ?? (cert?.url ?? ""),
      proposalUrl: proposalUrl ?? (prop?.url ?? ""),
    });

    await prisma.policyEvent.create({
      data: {
        policyId: policy.id,
        type: "EMAIL_SENT",
        data: { ok: true },
      },
    });

    // Return preview info (only when matched)
    return NextResponse.json(
      {
        ok: true,
        certificateUrl: certificateUrl ?? undefined,
        policy: {
          policyNumber: policy.policyNumber,
          email: policy.email,
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
  } catch (e: any) {
    // If you want to avoid leaking anything at all, you can return { ok: true } here.
    // But since this is your own UI flow, a 500 is useful during dev:
    return NextResponse.json({ error: e?.message ?? "Failed to retrieve policy" }, { status: 500 });
  }
}
