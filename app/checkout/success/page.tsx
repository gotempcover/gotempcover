import Link from "next/link";
import { prisma } from "@/db/prisma";
import AutoRefresh from "./AutoRefresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Date(d).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function vehicleLine(p: {
  vrm: string;
  make: string | null;
  model: string | null;
  year: string | null;
}) {
  const mm = [p.make, p.model].filter(Boolean).join(" ");
  return `${p.vrm}${mm ? ` • ${mm}` : ""}${p.year ? ` • ${p.year}` : ""}`;
}

export default async function SuccessPage(props: {
  // Next 16 can pass this as a Promise
  searchParams?: { session_id?: string } | Promise<{ session_id?: string }>;
}) {
  const sp = await Promise.resolve(props.searchParams ?? {});
  const sessionId = (sp.session_id ?? "").trim();

  // If no session_id, show graceful fallback + still auto-refresh
  if (!sessionId) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[12px] font-extrabold text-slate-700 ring-1 ring-slate-200">
            Payment received
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Thanks — we’re finalising your policy
          </h1>

          <p className="mt-2 text-slate-600">
            Your documents will be emailed shortly. If you can’t find them, use Retrieve policy.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/">
              Back to home
            </Link>
            <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/retrieve-policy">
              Retrieve policy
            </Link>
          </div>

          {/* In case Stripe redirects without session_id (rare), keep retrying */}
          <AutoRefresh />
        </div>
      </main>
    );
  }

  const policy = await prisma.policy.findUnique({
    where: {
      paymentProvider_paymentId: {
        paymentProvider: "STRIPE",
        paymentId: sessionId,
      },
    },
    select: {
      policyNumber: true,
      email: true,
      vrm: true,
      make: true,
      model: true,
      year: true,
      startAt: true,
      endAt: true,
      status: true,
      createdAt: true,
    },
  });

  // If webhook still processing, render "finalising" + auto refresh
  if (!policy) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-extrabold text-emerald-800 ring-1 ring-emerald-100">
                Payment confirmed
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                Finalising your policy…
              </h1>

              <p className="mt-2 text-slate-600">
                This usually takes a few seconds. Keep this tab open — we’ll update automatically.
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Session
              </div>
              <div className="mt-1 max-w-[260px] truncate text-[12px] text-slate-600">
                {sessionId}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
            <div className="text-sm font-semibold text-slate-900">What happens next</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• Policy created</li>
              <li>• Documents generated</li>
              <li>• Email sent to your inbox</li>
            </ul>
            <div className="mt-3 text-[12px] text-slate-500">
              If it doesn’t arrive, check junk or use Retrieve policy.
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/">
              Back to home
            </Link>
            <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/retrieve-policy">
              Retrieve policy
            </Link>
          </div>

          <AutoRefresh />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-extrabold text-emerald-800 ring-1 ring-emerald-100">
              Payment received
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              You’re covered ✅
            </h1>

            <p className="mt-2 text-slate-600">
              We’ve created your policy and emailed over your documents. Ensure you save your Policy Number.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Policy number
            </div>
            <div className="mt-1 text-base font-extrabold text-slate-900">
              {policy.policyNumber}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Policy number
              </div>
              <div className="mt-1 text-base font-extrabold text-slate-900">
                {policy.policyNumber}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Email
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 break-all">
                {policy.email}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {vehicleLine(policy)}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Start
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {fmt(policy.startAt)}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                End
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {fmt(policy.endAt)}
              </div>
            </div>
          </div>

          <div className="mt-4 text-[12px] text-slate-500">
            If you can’t see the email, check junk and then use Retrieve policy.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/">
            Back to home
          </Link>

          <Link className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white" href="/retrieve-policy">
            Retrieve policy
          </Link>
        </div>
      </div>
    </main>
  );
}
