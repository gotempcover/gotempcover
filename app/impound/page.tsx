"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import QuoteWidget from "@/components/quote/QuoteWidget";

type Term = "hourly" | "daily" | "weekly" | "monthly";

/* =========================================================
   Small UI helpers
========================================================= */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

function Stars({ label = "Excellent" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 text-[12px] text-slate-600 shadow-sm backdrop-blur">
      <span className="font-extrabold text-slate-900">{label}</span>
      <span className="text-slate-400">•</span>
      <span className="tracking-[2px] text-amber-500" aria-hidden="true">
        ★★★★★
      </span>
      <span className="sr-only">Five star rating</span>
      <span className="text-slate-400">•</span>
      <span>Customer reviews</span>
    </div>
  );
}

function TrustStrip() {
  const items = [
    "Secure checkout (Stripe)",
    "Documents available instantly after purchase",
    "Policy retrieval anytime",
    "Clear steps before you pay",
  ];

  return (
    <div className="mt-5 grid gap-2 text-[12px] text-slate-600">
      {items.map((t) => (
        <div key={t} className="flex items-center gap-2 leading-snug">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

function SegmentedOption({
  active,
  label,
  sub,
  onClick,
}: {
  active?: boolean;
  label: string;
  sub?: string;
  onClick?: () => void;
}) {
  // Premium: selected feels “active”, but never dark/cheap.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={[
        "relative w-full rounded-2xl px-3 py-2.5 text-left transition",
        "ring-1 ring-slate-200 bg-white hover:bg-slate-50",
        active ? "ring-emerald-200 bg-emerald-50/40" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <span
          className={[
            "mt-1 h-2 w-2 rounded-full transition",
            active ? "bg-emerald-500" : "bg-slate-300",
          ].join(" ")}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="text-[12px] font-extrabold text-slate-900">{label}</div>
          {sub ? <div className="mt-0.5 text-[11px] text-slate-500 leading-snug">{sub}</div> : null}
        </div>
      </div>

      {active ? (
        <span
          className="pointer-events-none absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-emerald-500/80"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

function CheckItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
      <div className="min-w-0">
        <div className="text-sm font-extrabold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function StepRow({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-2 text-[13px] text-slate-700">
      <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold">
        {n}
      </span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}

function MiniFaq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm font-extrabold text-slate-900">{q}</div>
          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-open:rotate-45">
            +
          </span>
        </div>
        <div className="mt-1 text-[12px] text-slate-500">Click to expand</div>
      </summary>
      <div className="mt-3 text-sm text-slate-700 leading-relaxed">{a}</div>
    </details>
  );
}

function InfoCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string;
  helper?: string;
  icon: React.ReactNode;
}) {
  // grid prevents icon squish
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid grid-cols-[1fr_auto_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
          <div className="mt-1 text-base font-extrabold text-slate-900 break-words">{value}</div>
          {helper ? <div className="mt-1 text-[12px] text-slate-500">{helper}</div> : null}
        </div>
        <span className="w-1" aria-hidden="true" />
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Page
========================================================= */

export default function ImpoundPage() {
  const [term, setTerm] = useState<Term>("daily");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("term");
    if (t === "hourly" || t === "daily" || t === "weekly" || t === "monthly") setTerm(t);
  }, []);

  const content = useMemo(() => {
    const map: Record<
      Term,
      { label: string; headline: string; sub: string; useCases: { t: string; d: string }[]; termHint: string }
    > = {
      hourly: {
        label: "Hourly",
        termHint: "Short window",
        headline: "Impound cover for quick release collection",
        sub: "Best for a controlled window — collection, paperwork, and a direct journey after release.",
        useCases: [
          { t: "Release appointment", d: "Collect and drive away the same day." },
          { t: "Short trip home", d: "Direct route from compound to your chosen location." },
          { t: "Time-sensitive pickups", d: "Cover for a brief window when timing is tight." },
        ],
      },
      daily: {
        label: "Daily",
        termHint: "Most practical",
        headline: "Daily impound cover for release and onward travel",
        sub: "A solid option when timing is uncertain — cover for release, admin, and travel.",
        useCases: [
          { t: "Compound delays", d: "If release time is not guaranteed." },
          { t: "Same-day admin", d: "Time for payment, checks, and paperwork." },
          { t: "One-day journey", d: "Drive home and sort follow-up later." },
        ],
      },
      weekly: {
        label: "Weekly",
        termHint: "Bridge cover",
        headline: "Weekly cover for impound release and short-term use",
        sub: "Useful if you need a few days after release to arrange longer-term insurance.",
        useCases: [
          { t: "Between policies", d: "Bridge cover while setting up annual insurance." },
          { t: "Repairs & checks", d: "Time to service or inspect the vehicle after release." },
          { t: "Short arrangements", d: "Temporary use with no annual commitment." },
        ],
      },
      monthly: {
        label: "Monthly",
        termHint: "More runway",
        headline: "Monthly impound cover for extended temporary needs",
        sub: "For longer temporary use after release — clean pricing, no annual lock-in.",
        useCases: [
          { t: "Sorting replacement cover", d: "Time to compare longer-term options properly." },
          { t: "Extended temporary use", d: "If you’ll rely on the vehicle for a few weeks." },
          { t: "Admin + stability", d: "One window while you organise next steps." },
        ],
      },
    };

    return map[term];
  }, [term]);

  return (
    <PageShell
      eyebrow="Impound Insurance"
      title="Impound cover to help release your vehicle"
      subtitle="Clear steps, exact cover times, and documents available instantly after purchase."
      crumbs={[{ label: "Home", href: "/" }, { label: "Impound" }]}
      ctaLabel="Get a quote"
      ctaHref="/impound#quote"
    >
      {/* HERO (premium + compliance-safe) */}
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-400/10 via-blue-300/10 to-indigo-300/10" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>Clear checklist</Pill>
                <Pill>Exact start & end times</Pill>
                <Pill>UK documents</Pill>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {content.headline}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">{content.sub}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Stars label="Excellent" />
                <div className="text-[12px] text-slate-500">
                  Reviews shown as placeholder until integrated.
                </div>
              </div>

              <TrustStrip />

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="#quote" className="btn-primary justify-center">
                  Start a quote
                </Link>
                <Link href="/help-support" className="btn-ghost justify-center">
                  Help & support
                </Link>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-sm text-slate-700">
                <div className="font-extrabold text-slate-900">Important</div>
                <div className="mt-1 leading-relaxed">
                  Requirements vary by compound and situation. Always confirm with the impound operator
                  exactly what documents they need before attending.
                </div>
              </div>
            </div>

            {/* Selector */}
            <div className="w-full max-w-[520px] shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Choose cover type
                </div>
                <Pill>{content.termHint}</Pill>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SegmentedOption active={term === "hourly"} label="Hourly" sub="Quick pickup window" onClick={() => setTerm("hourly")} />
                <SegmentedOption active={term === "daily"} label="Daily" sub="Most flexible day" onClick={() => setTerm("daily")} />
                <SegmentedOption active={term === "weekly"} label="Weekly" sub="Bridge to annual" onClick={() => setTerm("weekly")} />
                <SegmentedOption active={term === "monthly"} label="Monthly" sub="More time to sort" onClick={() => setTerm("monthly")} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-extrabold text-slate-900">Four simple steps</div>
                <div className="mt-2 grid gap-2">
                  <StepRow n={1} text="Enter your reg and confirm vehicle details." />
                  <StepRow n={2} text="Choose your exact cover times (and term)." />
                  <StepRow n={3} text="Review details and pay securely." />
                  <StepRow n={4} text="Access documents instantly after purchase." />
                </div>

                <div className="mt-4">
                  <Link href="#quote" className="btn-primary w-full justify-center">
                    Get a quote
                  </Link>
                  <div className="mt-2 text-center text-[12px] text-slate-500">
                    Takes ~2 minutes • Choose exact times
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Common reasons</div>
            <p className="mt-1 text-sm text-slate-600">
              Why people choose {content.label.toLowerCase()} impound cover.
            </p>
          </div>
          <Link href="#quote" className="btn-ghost hidden sm:inline-flex">
            Start a quote
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {content.useCases.map((x) => (
            <div key={x.t} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-extrabold text-slate-900">{x.t}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist + What we provide */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-extrabold text-slate-900">What you’ll usually need</div>
          <p className="mt-1 text-sm text-slate-600">
            Most compounds ask for some combination of the following.
          </p>

          <div className="mt-5 grid gap-4">
            <CheckItem title="Proof of identity" desc="Driving licence or other accepted ID (rules vary)." />
            <CheckItem title="Proof of address" desc="Often requested — bring recent proof if you have it." />
            <CheckItem title="Authority to collect" desc="If you’re not the keeper, you may need permission/letter." />
            <CheckItem title="Payment method" desc="Some compounds require specific payment types — confirm ahead." />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-sm text-slate-700">
            <div className="font-extrabold text-slate-900">Tip</div>
            <div className="mt-1 leading-relaxed">
              Call the compound first and ask for their exact checklist — it avoids wasted trips.
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-extrabold text-slate-900">What GoTempCover provides</div>
          <p className="mt-1 text-sm text-slate-600">
            After purchase, your documentation is available instantly and sent by email.
          </p>

          <div className="mt-5 grid gap-4">
            <CheckItem title="Instant documents" desc="Available immediately after purchase (and emailed to you)." />
            <CheckItem title="Policy retrieval anytime" desc="Access documents later using your details/policy reference." />
            <CheckItem title="Exact cover times" desc="Choose precise start & end times for your release window." />
            <CheckItem title="Clear journey" desc="You’ll review everything before payment." />
          </div>

          <div className="mt-5 flex flex-col gap-2 text-[12px] text-slate-600">
            {["Secure checkout (Stripe)", "Instant documents", "Policy retrieval anytime"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link href="#quote" className="btn-primary justify-center w-full sm:w-auto">
              Start a quote
            </Link>
            <Link href="/retrieve-policy" className="btn-ghost justify-center w-full sm:w-auto">
              Retrieve policy
            </Link>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="mt-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Impound FAQs
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Quick answers before you attend the compound.
              </p>
            </div>

            <Link href="/help-support" className="btn-ghost hidden sm:inline-flex">
              Visit help centre
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            <MiniFaq
              q="Will the compound accept my documents?"
              a="Acceptance depends on the compound’s rules and your situation. Always confirm their requirements before attending."
            />
            <MiniFaq
              q="How fast do I get documents after paying?"
              a="After purchase, your documents are available instantly and sent to your email."
            />
            <MiniFaq
              q="Can I choose exact cover times?"
              a="Yes — you choose exact start and end times to match your release window."
            />
            <MiniFaq
              q="What if vehicle lookup can’t find my car?"
              a="No problem — you can enter make and model manually and continue."
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="#quote" className="btn-primary justify-center">
              Start a quote
            </Link>
            <Link href="/help-support" className="btn-ghost justify-center">
              Help & support
            </Link>
          </div>
        </div>
      </section>

      {/* Support block (email + hours) */}
      <section className="mt-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Need a hand?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                If you’re unsure what to enter, we can help you through the quote flow.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoCard
                  title="Email"
                  value="support@gotempcover.com"
                  helper="We usually reply within one business day."
                  icon={<IconMail />}
                />
                <InfoCard
                  title="Opening hours"
                  value="Mon–Sat, 9am–5pm"
                  helper="Closed Sundays & bank holidays."
                  icon={<IconClock />}
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="btn-ghost justify-center">
                  Contact us
                </Link>
                <Link href="/help-support" className="btn-ghost justify-center">
                  Help centre
                </Link>
              </div>

              <div className="mt-3 text-[12px] text-slate-500">
                Please don’t share card details by email.
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Before you go
              </div>

              <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                {[
                  "Call the compound and confirm their exact document checklist",
                  "Bring ID and (if requested) proof of address",
                  "If you’re not the keeper, bring authority to collect",
                  "Choose cover times that match your release window",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-extrabold text-slate-900">Already bought cover?</div>
                <p className="mt-1 text-sm text-slate-600">
                  Retrieve your policy documents anytime.
                </p>
                <Link href="/retrieve-policy" className="btn-primary mt-4 w-full justify-center">
                  Retrieve policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="mt-10 scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-slate-900">Get your quote</div>
            <p className="mt-1 text-sm text-slate-600">
              Enter your reg, confirm your vehicle, then pick your exact cover dates.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <QuoteWidget />
        </div>
      </section>

      {/* Compliance strip */}
      <div className="mt-8 flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
        {[
          "Requirements vary by compound and situation",
          "Eligibility and underwriting apply",
          "Always read your policy documents carefully",
        ].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* =========================================================
   Inline icons (no libs)
========================================================= */

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 17 19H7a2.5 2.5 0 0 1-2.5-2.5v-9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6.8 8.2 12 12l5.2-3.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
