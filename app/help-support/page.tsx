"use client";

import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import React from "react";

/* =========================================================
   Small UI bits
========================================================= */

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-extrabold text-slate-700 ring-1 ring-slate-200 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function AccentDot() {
  return <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />;
}

function TrustStrip() {
  const items = ["Secure checkout (Stripe)", "Instant documents after purchase", "Policy retrieval anytime"];
  return (
    <div className="mt-5 flex flex-col gap-2 text-[12px] text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
      {items.map((t) => (
        <div key={t} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200", className].join(" ")}>
      {children}
    </div>
  );
}

function IconBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

function InfoRow({
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
  // Grid layout prevents icon squish / overlap
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
          <div className="mt-1 text-base font-extrabold text-slate-900 break-words">{value}</div>
          {helper ? <div className="mt-1 text-[12px] text-slate-500">{helper}</div> : null}
        </div>

        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TopicCard({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200",
        "transition hover:ring-slate-300 hover:shadow-[0_16px_44px_-26px_rgba(2,6,23,0.45)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <IconBadge>{icon}</IconBadge>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-slate-900">
        View
        <span className="text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}

function FaqItem({
  q,
  a,
}: {
  q: string;
  a: React.ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm font-extrabold text-slate-900">{q}</div>
          <span
            className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </div>
        <div className="mt-1 text-[12px] text-slate-500">Click to expand</div>
      </summary>

      <div className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</div>
    </details>
  );
}

/* =========================================================
   Page
========================================================= */

export default function HelpSupportPage() {
  return (
    <div className="bg-wash">
      <PageShell
        eyebrow="Help & Support"
        title="Need a hand?"
        subtitle="Clear answers, document retrieval, and next steps — designed to reduce friction."
        crumbs={[{ label: "Home", href: "/" }, { label: "Help & Support" }]}
        ctaLabel="Retrieve policy"
        ctaHref="/retrieve-policy"
      >
        {/* HERO / ACTIONS */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/12 via-blue-300/10 to-indigo-300/10" />
            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
                  <AccentDot />
                  Fast answers • No runaround
                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Support built for real journeys
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  Most customers come here to retrieve documents, check eligibility, or confirm timing.
                  If something looks off, we’ll point you to the right next step.
                </p>

                <TrustStrip />

                <div className="mt-5 flex flex-wrap gap-2">
                  <SoftChip>Mon–Sat support</SoftChip>
                  <SoftChip>Instant retrieval</SoftChip>
                  <SoftChip>Clear guidance</SoftChip>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Quick actions
                  </div>

                  <div className="mt-3 grid gap-3">
                    <Link href="/retrieve-policy" className="btn-primary w-full justify-center">
                      Retrieve policy documents
                    </Link>
                    <Link href="/more/faq" className="btn-ghost w-full justify-center">
                      View FAQs
                    </Link>
                    <Link href="/get-quote" className="btn-ghost w-full justify-center">
                      Start a new quote
                    </Link>

                    <div className="text-center text-[12px] text-slate-500">
                      Tip: have your policy number ready.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT (the “Need a hand?” block you showed earlier) */}
        <div className="mt-8 grid gap-4 lg:grid-cols-6">
          <CardShell className="lg:col-span-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">Contact details</div>
                <p className="mt-2 text-sm text-slate-600">
                  For quotes, documents, and policy retrieval help.
                </p>
              </div>
              <SoftChip>Support</SoftChip>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoRow
                title="Email"
                value="support@gotempcover.com"
                helper="We usually reply within one business day."
                icon={<IconMail />}
              />
              <InfoRow
                title="Opening hours"
                value="Mon–Sat, 9am–5pm"
                helper="Closed Sundays & bank holidays."
                icon={<IconClock />}
              />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link href="/contact" className="btn-ghost w-full justify-center">
                Contact us
              </Link>
              <Link href="/more" className="btn-ghost w-full justify-center">
                Browse resources
              </Link>
            </div>
          </CardShell>

          <CardShell className="lg:col-span-3">
            <div className="text-sm font-extrabold text-slate-900">Common help topics</div>
            <p className="mt-2 text-sm text-slate-600">
              Start with the most common scenarios — clean, fast answers.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                "How to retrieve documents using your policy reference",
                "Updating cover dates before purchase",
                "Vehicle lookup not found — entering details manually",
                "Understanding eligibility and acceptance",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <div className="text-sm text-slate-700">{t}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Link href="/retrieve-policy" className="btn-primary w-full justify-center">
                Retrieve policy
              </Link>
            </div>
          </CardShell>
        </div>

        {/* TOPIC GRID */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Popular
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">Help topics</div>
            </div>
            <Link href="/more/faq" className="btn-ghost">
              View all FAQs
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TopicCard
              title="Documents & retrieval"
              desc="Where your schedule/certificate lives, and how to access it quickly."
              href="/retrieve-policy"
              icon={<IconDoc />}
            />
            <TopicCard
              title="Cover start & end times"
              desc="How timing works and how to avoid common mistakes before checkout."
              href="/more/faq"
              icon={<IconTimer />}
            />
            <TopicCard
              title="Vehicle lookup issues"
              desc="What to do if your reg lookup fails — and how to continue manually."
              href="/more/faq"
              icon={<IconCar />}
            />
          </div>
        </div>

        {/* SIMPLE, PREMIUM FAQ STRIP (not jumbled) */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Quick answers
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">
                Frequently asked
              </div>
            </div>
            <Link href="/more/faq" className="btn-ghost">
              Open full FAQ
            </Link>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <FaqItem
              q="How quickly can I get covered?"
              a="Most customers complete the quote flow in a couple of minutes. After payment, your documents are available instantly and sent by email."
            />
            <FaqItem
              q="What if my vehicle lookup doesn’t find my reg?"
              a="You can enter make/model details manually and continue. Lookup failing doesn’t automatically mean you’re not eligible — it just means we couldn’t prefill details."
            />
            <FaqItem
              q="Can I choose exact start and end times?"
              a="Yes — you select exact start and end times during your quote, so you avoid paying for time you don’t need."
            />
            <FaqItem
              q="How do I retrieve my policy documents later?"
              a={
                <>
                  Use the <Link href="/retrieve-policy" className="a">Retrieve policy</Link> page and enter your policy reference.
                  No account needed.
                </>
              }
            />
          </div>
        </div>

        {/* FOOTER CTA WASH */}
        <div className="mt-10 rounded-[28px] bg-white/75 backdrop-blur p-6 ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">Still stuck?</div>
              <p className="mt-1 text-sm text-slate-600">
                Start with retrieval. If something looks wrong, contact support and we’ll guide you.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link href="/retrieve-policy" className="btn-primary justify-center">
                Retrieve policy
              </Link>
              <Link href="/contact" className="btn-ghost justify-center">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

/* =========================================================
   Inline icons (no deps)
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
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTimer() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconCar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 16.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7.2 7.8c.3-.8 1.1-1.3 2-1.3h5.6c.9 0 1.7.5 2 1.3l1.3 3.5c.2.6.4 1.2.4 1.8V17c0 .6-.4 1-1 1h-1.2a1 1 0 0 1-1-1v-.5H8.7v.5a1 1 0 0 1-1 1H6.5c-.6 0-1-.4-1-1v-2.4c0-.6.1-1.2.4-1.8l1.3-3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8 13h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 13h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
