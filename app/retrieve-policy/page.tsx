"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function normaliseEmail(v: string) {
  return v.trim().toLowerCase();
}

function normalisePolicyNumber(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "");
}

type RetrievePolicyResponse = {
  ok?: boolean;
  certificateUrl?: string;
  policy?: {
    policyNumber: string;
    email: string;
    vrm: string;
    make: string | null;
    model: string | null;
    year: string | null;
    startAt: string | Date;
    endAt: string | Date;
  };
  error?: string;
};

function fmt(dt: string | Date) {
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function vehicleLine(p?: RetrievePolicyResponse["policy"] | null) {
  if (!p) return "—";
  const mm = [p.make, p.model].filter(Boolean).join(" ");
  return `${p.vrm}${mm ? ` • ${mm}` : ""}${p.year ? ` • ${p.year}` : ""}`;
}

export default function RetrievePolicyPage() {
  const [policyNumber, setPolicyNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [policy, setPolicy] = useState<RetrievePolicyResponse["policy"] | null>(null);

  const canSubmit = useMemo(() => {
    const pn = normalisePolicyNumber(policyNumber);
    const em = normaliseEmail(email);
    return pn.length >= 6 && em.includes("@") && em.includes(".");
  }, [policyNumber, email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setCertificateUrl(null);
    setPolicy(null);

    const pn = normalisePolicyNumber(policyNumber);
    const em = normaliseEmail(email);

    setLoading(true);
    try {
      const res = await fetch("/api/retrieve-policy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ policyNumber: pn, email: em }),
      });

      const data = (await res.json().catch(() => ({}))) as RetrievePolicyResponse;

      if (!res.ok) {
        throw new Error(data?.error || "We couldn’t resend your documents. Please try again.");
      }

      // Generic success message (keeps privacy: doesn’t reveal if a policy exists)
      setOk("If we found a matching policy, we’ve re-sent your documents. Please check your inbox (and junk).");

      // Optional nice UX: show preview if API returns it (only when matched)
      setCertificateUrl(data?.certificateUrl ?? null);
      setPolicy(data?.policy ?? null);

      setPolicyNumber(pn);
      setEmail(em);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[12px] font-extrabold text-slate-700 ring-1 ring-slate-200">
          Retrieve policy
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Resend your documents
        </h1>
        <p className="mt-2 text-slate-600">
          Enter your policy number and the email used at checkout — we’ll resend your certificate and proposal.
        </p>

        <form onSubmit={onSubmit} className="mt-7 grid gap-4">
          <div>
            <label className="label" htmlFor="policyNumber">Policy number</label>
            <input
              id="policyNumber"
              className="input"
              placeholder="e.g. GTC-26-AB12CD34"
              value={policyNumber}
              onChange={(e) => {
                setPolicyNumber(e.target.value);
                setErr(null);
                setOk(null);
                setCertificateUrl(null);
                setPolicy(null);
              }}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="field-hint">Found on your confirmation email or PDF documents.</div>
          </div>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              placeholder="e.g. name@email.com"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr(null);
                setOk(null);
                setCertificateUrl(null);
                setPolicy(null);
              }}
            />
            <div className="field-hint">Must match the email used when purchasing.</div>
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="font-extrabold">Action needed</div>
              <div className="mt-1">{err}</div>
            </div>
          ) : null}

          {ok ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div className="font-extrabold">Sent</div>
              <div className="mt-1">{ok}</div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`btn-primary mt-2 w-full ${(!canSubmit || loading) ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Resending…" : "Resend documents"}
          </button>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="btn-ghost" href="/">Back to home</Link>
            <Link className="btn-ghost" href="/get-quote">Get a new quote</Link>
          </div>

          <div className="mt-2 text-[12px] text-slate-500">
            Tip: emails can take 1–2 minutes. Check junk/spam.
          </div>
        </form>
      </div>

      {/* OPTIONAL: Policy summary + certificate preview (only if API returns it) */}
      {(policy || certificateUrl) ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Certificate preview</div>
              <div className="mt-1 text-sm text-slate-600">
                If available, your certificate will appear here. You can also download it.
              </div>
            </div>

            {certificateUrl ? (
              <a
                className="btn-ghost"
                href={certificateUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download certificate
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[12px] font-extrabold text-slate-700 ring-1 ring-slate-200">
                Not available yet
              </span>
            )}
          </div>

          {policy ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
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
            </div>
          ) : null}

          {certificateUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200/60">
              <div className="h-[70vh]">
                <iframe
                  title="Certificate preview"
                  src={certificateUrl}
                  className="h-full w-full"
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 text-[12px] text-slate-500">
              If your policy is still being finalised, try again in a minute — or check your inbox.
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}
