"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import QuoteWidget from "@/components/quote/QuoteWidget";

type Term = "hourly" | "daily" | "weekly" | "monthly";

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={[
        "relative w-full rounded-2xl px-3 py-2.5 text-left transition",
        "ring-1 ring-slate-200 bg-white hover:bg-slate-50",
        active ? "ring-slate-900" : "",
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
          <div className={["text-[12px] font-extrabold", active ? "text-slate-900" : "text-slate-800"].join(" ")}>
            {label}
          </div>
          {sub ? <div className="mt-0.5 text-[11px] text-slate-500 leading-snug">{sub}</div> : null}
        </div>
      </div>

      {active ? (
        <span
          className="pointer-events-none absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-slate-900/70"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

function TrustStrip() {
  const items = [
    "Secure checkout (Stripe)",
    "Documents available instantly after purchase",
    "Retrieve your policy anytime",
    "Clear steps and pricing before you pay",
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
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {/* grid prevents icon squish */}
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

export default function CarPage() {
  const [term, setTerm] = useState<Term>("hourly");

  // Optional: allow /car?term=monthly etc.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("term");
    if (t === "hourly" || t === "daily" || t === "weekly" || t === "monthly") setTerm(t);
  }, []);

  const content = useMemo(() => {
    const map: Record<
      Term,
      {
        label: string;
        headline: string;
        sub: string;
        timeHint: string;
        idealFor: { t: string; d: string }[];
      }
    > = {
      hourly: {
        label: "Hourly",
        headline: "Hourly car insurance for quick cover",
        sub: "Choose exact start and end times — ideal when you only need a few hours.",
        timeHint: "Great for short drives and one-off trips",
        idealFor: [
          { t: "Short errands", d: "Quick trip across town, pickup, drop-off." },
          { t: "Test drives", d: "Temporary cover for private viewings." },
          { t: "Borrowing a car", d: "Cover yourself to drive a friend’s car." },
        ],
      },
      daily: {
        label: "Daily",
        headline: "Daily car insurance for day trips",
        sub: "Perfect for a full day of cover — start when you choose.",
        timeHint: "Ideal for day trips and car sharing",
        idealFor: [
          { t: "Day trips", d: "Visiting family or a one-day journey." },
          { t: "Car sharing", d: "Cover for a full day of driving." },
          { t: "Last-minute cover", d: "Need insurance today? Start in minutes." },
        ],
      },
      weekly: {
        label: "Weekly",
        headline: "Weekly car insurance without long contracts",
        sub: "Great value for short-term use over a week — no annual commitment.",
        timeHint: "Better value across multiple days",
        idealFor: [
          { t: "Visiting home", d: "Cover while you’re back for the week." },
          { t: "Car swaps", d: "Driving another car temporarily." },
          { t: "Short arrangements", d: "Temporary cover without annual policies." },
        ],
      },
      monthly: {
        label: "Monthly",
        headline: "Monthly car insurance for longer temporary cover",
        sub: "Ideal when you need cover for weeks to a month — clean pricing, no annual lock-in.",
        timeHint: "Best for longer temporary needs",
        idealFor: [
          { t: "Between cars", d: "Cover while sorting a replacement vehicle." },
          { t: "Extended visits", d: "Driving while staying away from home." },
          { t: "Short arrangements", d: "Temporary cover without yearly commitment." },
        ],
      },
    };
    return map[term];
  }, [term]);

  return (
    <PageShell
      eyebrow="Temporary Car Insurance"
      title="Car cover that starts when you choose"
      subtitle="Pick your exact start and end time, review the best-value option for your cover period, then check out securely."
      crumbs={[{ label: "Home", href: "/" }, { label: "Car" }]}
      ctaLabel="Get a quote"
      ctaHref="/car#quote"
    >
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-400/10 via-blue-300/10 to-indigo-300/10" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <SoftChip>Exact start & end times</SoftChip>
                <SoftChip>Instant documents after purchase</SoftChip>
                <SoftChip>Policy retrieval anytime</SoftChip>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {content.headline}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {content.sub}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Stars label="Excellent" />
                <div className="text-[12px] text-slate-500">
                </div>
              </div>

              <TrustStrip />

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="#quote" className="btn-primary justify-center">
                  Start a quote
                </Link>
                <Link href="/retrieve-policy" className="btn-ghost justify-center">
                  Retrieve a policy
                </Link>
              </div>

              <div className="mt-3 text-[12px] text-slate-500">
                Eligibility, underwriting and insurer acceptance apply.
              </div>
            </div>

            {/* TERM SELECTOR */}
            <div className="shrink-0 w-full max-w-[520px]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Choose cover type
                </div>
                <SoftChip>{content.timeHint}</SoftChip>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <SegmentedOption active={term === "hourly"} label="Hourly" sub="A few hours" onClick={() => setTerm("hourly")} />
                <SegmentedOption active={term === "daily"} label="Daily" sub="One-day cover" onClick={() => setTerm("daily")} />
                <SegmentedOption active={term === "weekly"} label="Weekly" sub="Short stays" onClick={() => setTerm("weekly")} />
                <SegmentedOption active={term === "monthly"} label="Monthly" sub="Longer temp" onClick={() => setTerm("monthly")} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="text-sm font-extrabold text-slate-900">What you’ll do next</div>
                <ol className="mt-2 grid gap-2 text-[13px] text-slate-700">
                  <li className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold">1</span>
                    Enter your registration and confirm your vehicle.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold">2</span>
                    Choose exact start/end times.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold">3</span>
                    Pick the best-value price option for your cover period.
                  </li>
                </ol>

                <div className="mt-4">
                  <Link href="#quote" className="btn-primary w-full justify-center">
                    Get a quote
                  </Link>
                  <div className="mt-2 text-center text-[12px] text-slate-500">Typically ~2 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDEAL FOR */}
      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Ideal for</div>
            <p className="mt-1 text-sm text-slate-600">
              Common reasons people choose {content.label.toLowerCase()} car cover.
            </p>
          </div>
          <Link href="#quote" className="btn-ghost hidden sm:inline-flex">
            Start a quote
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {content.idealFor.map((x) => (
            <div key={x.t} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-extrabold text-slate-900">{x.t}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HELP + CONTACT (support-forward) */}
      <section className="mt-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Need a hand?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Our support team can help with quotes, documents and policy retrieval.
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
                Common help topics
              </div>

              <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                {[
                  "How to retrieve documents using your policy reference",
                  "Updating cover dates before purchase",
                  "Vehicle lookup not found — entering details manually",
                  "Understanding eligibility and acceptance",
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

      {/* MINI FAQ (car specific) */}
      <section className="mt-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Car cover FAQs
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Quick answers to the most common questions.
              </p>
            </div>

            <Link href="/help-support" className="btn-ghost hidden sm:inline-flex">
              Visit help centre
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            <MiniFaq
              q="Can I choose an exact start time?"
              a="Yes. You’ll choose exact start and end times during the quote flow. If you want to start immediately, use Start now for a convenient rounded time."
            />
            <MiniFaq
              q="How quickly do I get documents?"
              a="After purchase, your documents are available instantly and also sent to your email."
            />
            <MiniFaq
              q="What if vehicle lookup doesn’t find my car?"
              a="No problem — you can enter make and model manually and continue."
            />
            <MiniFaq
              q="Does everyone qualify for cover?"
              a="Eligibility depends on driver and vehicle details, underwriting rules, and acceptance by the insurer."
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="#quote" className="btn-primary justify-center">
              Start a quote
            </Link>
            <Link href="/retrieve-policy" className="btn-ghost justify-center">
              Retrieve a policy
            </Link>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section id="quote" className="mt-10 scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-slate-900">Get your quote</div>
            <p className="mt-1 text-sm text-slate-600">
              Enter your registration, confirm your vehicle, then pick your exact cover dates.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <QuoteWidget compact={false} />
        </div>
      </section>

      {/* COMPLIANCE STRIP */}
      <div className="mt-8 flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
        {[
          "Eligibility and underwriting apply",
          "You’ll review details before payment",
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
