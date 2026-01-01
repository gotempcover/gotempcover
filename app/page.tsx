"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import QuoteWidget from "@/components/quote/QuoteWidget";

/* =========================================================
   GoTempCover — Homepage (50k agency build level)
   - Single quote form (hero)
   - Strong “Why choose” + trust strip
   - Reviews badge (compliance-friendly placeholder)
   - Support hours + email section
   - FAQ section (homepage-sized)
   - All secondary buttons = ghost/light (per your rule)
========================================================= */

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-900">
      <main>
        <StickyMiniCta />

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-400/10 via-blue-300/10 to-indigo-300/10 animate-gradient" />
          <ParallaxTexture />

          <div className="relative z-10 container-app py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 text-[12px] text-slate-600 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Choose exact times • Secure checkout • Instant documents after purchase
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight"
              >
                Temporary cover,{" "}
                <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
                  without the hassle
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.06 }}
                className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
              >
                Set your start and end time, see a clear price, then check out securely. Your documents
                are available instantly after purchase and sent by email.
              </motion.p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link className="btn-primary w-full sm:w-auto" href="#quote">
                    Get a quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Link className="btn-ghost w-full sm:w-auto" href="/retrieve-policy">
                    Retrieve a policy
                  </Link>
                </motion.div>
              </div>

              {/* Trust strip (hero) */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 shadow-sm backdrop-blur">
                  <span className="font-extrabold text-slate-900">Fast flow</span>
                  <span className="text-slate-400">•</span>
                  Typically 2 minutes
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 shadow-sm backdrop-blur">
                  <Stars />
                  <span className="font-extrabold text-slate-900">Excellent</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Verified reviews</span>
                  <span className="text-slate-400"></span>
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 px-4 py-1.5 shadow-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Instant docs after purchase
                </span>
              </div>
            </div>

            {/* HERO GRID */}
            <div id="quote" className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start scroll-mt-24">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/70 p-6 sm:p-7"
              >
                <QuoteWidget />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.18 }}
                className="card-soft p-6 sm:p-7"
              >
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Clear steps. Clear price. Clear documents.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Built for real-world journeys: borrowing a car, short-term cover, learner driving,
                  van use, or impound-related routes.
                </p>

                <div className="mt-6 grid gap-3">
                  <Benefit text="Pick exact start and end times (not vague ‘days’)" />
                  <Benefit text="Choose the best-value option for your cover period" />
                  <Benefit text="Instant documents after purchase (and emailed to you)" />
                  <Benefit text="Retrieve your policy anytime using your details" />
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Link className="btn-ghost justify-center" href="/car">
                    Car cover
                  </Link>
                  <Link className="btn-ghost justify-center" href="/van">
                    Van cover
                  </Link>
                  <Link className="btn-ghost justify-center" href="/learner">
                    Learner cover
                  </Link>
                  <Link className="btn-ghost justify-center" href="/impound">
                    Impound cover
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4">
                  <div className="text-[12px] font-extrabold text-slate-900">How it works</div>
                  <ol className="mt-2 grid gap-2 text-[13px] text-slate-700">
                    <li className="flex gap-2">
                      <StepNum n={1} /> Enter your reg and confirm your vehicle.
                    </li>
                    <li className="flex gap-2">
                      <StepNum n={2} /> Choose your start/end time and review your details.
                    </li>
                    <li className="flex gap-2">
                      <StepNum n={3} /> Pick the best-value option for your cover period.
                    </li>
                    <li className="flex gap-2">
                      <StepNum n={4} /> Pay securely, then access documents instantly.
                    </li>
                  </ol>
                </div>
              </motion.div>
            </div>

            {/* WHY CHOOSE */}
            <section className="mt-12 sm:mt-14">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      Why choose GoTempCover
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                      We’ve stripped away the usual friction: clear timing, clear pricing, and documents
                      you can actually find when you need them.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Pill icon={<IconShield />}>Secure checkout</Pill>
                      <Pill icon={<IconBolt />}>Instant documents</Pill>
                      <Pill icon={<IconClock />}>Exact start/end times</Pill>
                      <Pill icon={<IconSearch />}>Easy policy retrieval</Pill>
                    </div>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-slate-900">Straightforward, not salesy</div>
                          <p className="mt-1 text-sm text-slate-600">
                            You’ll review details before payment. Eligibility, underwriting and insurer acceptance apply.
                          </p>
                        </div>
                        <span className="badge">Compliant</span>
                      </div>

                      <div className="mt-4 grid gap-2 text-[13px] text-slate-700">
                        <TrustRow text="Transparent pricing, no hidden fees" />
                        <TrustRow text="Documents available instantly after purchase and sent by email" />
                        <TrustRow text="Support when you need it (Mon–Sat)" />
                      </div>
                    </div>
                  </div>

                  {/* Right: compact trust panel */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                          Trusted by drivers
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Stars />
                          <div className="text-sm font-extrabold text-slate-900">Excellent</div>
                          <div className="text-sm text-slate-500">(Verified Reviews)</div>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                        </p>
                      </div>
                      <span className="badge">4.8 ★</span>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <MiniTestimonial
                        quote="“Fast and easy — documents came through straight away.”"
                        meta="Lauren Mitchell"
                      />
                      <MiniTestimonial
                        quote="“Loved choosing the exact start time — no guessing.”"
                        meta="Haider Ahmed"
                      />
                      <MiniTestimonial
                        quote="“Had to retrieve my policy later — found it instantly.”"
                        meta="Aaron Green"
                      />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link className="btn-primary justify-center" href="#quote">
                        Start a quote
                      </Link>
                      <Link className="btn-ghost justify-center" href="/retrieve-policy">
                        Retrieve a policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FOUR SIMPLE STEPS */}
            <section className="mt-12 sm:mt-14">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    Four simple steps
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600">
                    A clean, fast journey from reg to documents.
                  </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-4">
                  <StepCard
                    n={1}
                    title="Vehicle"
                    desc="Tell us your registration and confirm your vehicle details."
                    icon={<IconCar />}
                  />
                  <StepCard
                    n={2}
                    title="Driver"
                    desc="Add your details so we can personalise the quote."
                    icon={<IconId />}
                  />
                  <StepCard
                    n={3}
                    title="Quote"
                    desc="Choose the best-value option for your cover period."
                    icon={<IconDoc />}
                  />
                  <StepCard
                    n={4}
                    title="Go"
                    desc="Check out securely — documents available instantly after purchase."
                    icon={<IconGo />}
                  />
                </div>

                <div className="mt-10 flex justify-center">
                  <Link href="#quote" className="btn-primary">
                    Get a quote
                  </Link>
                </div>

                <div className="mt-4 text-center text-[12px] text-slate-500">
                  Eligibility, underwriting and insurer acceptance apply.
                </div>
              </div>
            </section>

            {/* SUPPORT */}
            <section className="mt-12 sm:mt-14">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      Need a hand?
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                      Our support team can help with quotes, documents and policy retrieval.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        title="Email"
                        value="support@gotempcover.com"
                        helper="We usually reply within one business day."
                        icon={<IconMail />}
                        href="mailto:support@gotempcover.com"
                      />
                      <InfoCard
                        title="Opening hours"
                        value="Mon–Sat, 9am–5pm"
                        helper="Closed Sundays & bank holidays."
                        icon={<IconClock />}
                      />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link className="btn-ghost justify-center" href="/contact">
                        Contact us
                      </Link>
                      <Link className="btn-ghost justify-center" href="/help-support">
                        Help centre
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7">
                    <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                      Common help topics
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      <Reason text="How to retrieve documents using your policy reference" />
                      <Reason text="Updating cover dates before purchase" />
                      <Reason text="Vehicle lookup not found — entering details manually" />
                      <Reason text="Understanding eligibility and acceptance" />
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-extrabold text-slate-900">Already bought cover?</div>
                      <p className="mt-1 text-sm text-slate-600">
                        Retrieve your policy documents anytime.
                      </p>
                      <Link className="btn-primary mt-4 justify-center w-full" href="/retrieve-policy">
                        Retrieve policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-12 sm:mt-14">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      Questions, answered
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-slate-600">
                      Everything you need to know before you buy temporary cover.
                    </p>
                  </div>

                  <Link href="/more/faq" className="btn-ghost hidden sm:inline-flex">
                    Visit FAQs
                  </Link>
                </div>

                <div className="mt-6 grid gap-3">
                  <FaqItem
                    q="How quickly can I get covered?"
                    a="Most customers complete the quote flow in a couple of minutes. After payment, your documents are available instantly and sent to your email."
                  />
                  <FaqItem
                    q="What do I need to get a quote?"
                    a="Your vehicle registration, the dates/times you want cover, and your basic driver details. If lookup can’t find your vehicle, you can enter make/model manually."
                  />
                  <FaqItem
                    q="Can I choose an exact start time?"
                    a="Yes — you pick the exact start and end time. If you’re starting immediately, use Start now to set a convenient start time."
                  />
                  <FaqItem
                    q="How do I retrieve my policy documents later?"
                    a="Use Retrieve policy in the header or footer. You’ll be able to access your documents using your details/policy reference."
                  />
                  <FaqItem
                    q="Is everyone eligible?"
                    a="Eligibility depends on driver and vehicle details, underwriting rules, and acceptance by the insurer. You’ll see what’s available as you go through the quote."
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

            {/* Compliance-friendly reassurance */}
            <div className="mt-10 flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
              {[
                "Eligibility and underwriting apply",
                "Always read your policy documents carefully",
                "You’ll review details before payment",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA (no second form) */}
        <section className="py-14 sm:py-16">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    Ready when you are.
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                    Start your quote in seconds. You’ll confirm details, pick the best-value option,
                    then check out securely.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link className="btn-primary justify-center" href="#quote">
                      Start a quote
                    </Link>
                    <Link className="btn-ghost justify-center" href="/retrieve-policy">
                      Retrieve existing policy
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50/70 border border-slate-200 p-6">
                  <div className="text-[12px] font-extrabold text-slate-900">Popular reasons</div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <Reason text="Borrowing a car for the day" />
                    <Reason text="Short-term van use for work or moving" />
                    <Reason text="Learner driving practice" />
                    <Reason text="Cover needed quickly for a specific time window" />
                  </div>

                  <div className="mt-4 text-[12px] text-slate-500">
                    Tip: Have your reg and dates ready — the flow typically takes ~2 minutes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   Sticky CTA
========================================================= */

const StickyMiniCta = React.memo(function StickyMiniCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 260);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } bg-white/90 backdrop-blur-md border-b border-slate-200/70`}
    >
      <div className="container-app py-2.5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-extrabold text-slate-900">GoTempCover</div>
          <div className="text-[11px] text-slate-500 truncate">Temporary cover, without the hassle</div>
        </div>
        <Link href="#quote" className="btn-primary text-xs">
          Get quote
        </Link>
      </div>
    </div>
  );
});

/* =========================================================
   Visual texture
========================================================= */

const ParallaxTexture = React.memo(function ParallaxTexture() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 opacity-[0.14] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.12) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    />
  );
});

/* =========================================================
   Small UI bits
========================================================= */

const Benefit = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 h-6 w-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
      ✓
    </span>
    <div className="text-sm text-slate-700">{text}</div>
  </div>
);

function StepNum({ n }: { n: number }) {
  return (
    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-extrabold">
      {n}
    </span>
  );
}

function StepCard({
  n,
  title,
  desc,
  icon,
}: {
  n: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm">
        {icon}
      </div>
      <div className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
        {n}. {title}
      </div>
      <div className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
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

const Reason = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
    <div>{text}</div>
  </div>
);

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700">
      {icon ? <span className="text-slate-700">{icon}</span> : null}
      {children}
    </span>
  );
}

function TrustRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
        ✓
      </span>
      <div>{text}</div>
    </div>
  );
}

function MiniTestimonial({ quote, meta }: { quote: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">{quote}</div>
      <div className="mt-1 text-[12px] text-slate-500">{meta}</div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  helper,
  icon,
  href,
}: {
  title: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50/50 transition">
      {/* ✅ grid prevents icon squish */}
      <div className="grid grid-cols-[1fr_auto_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </div>
          <div className="mt-1 text-base font-extrabold text-slate-900 break-words">
            {value}
          </div>
          {helper ? <div className="mt-1 text-[12px] text-slate-500">{helper}</div> : null}
        </div>

        {/* optional tiny spacer to keep breathing room */}
        <span className="w-1" aria-hidden="true" />

        {icon ? (
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <a
      href={href}
      className="block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200/60"
    >
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function Stars() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-amber-500"
          aria-hidden="true"
        >
          <path d="M12 17.3l-6.18 3.64 1.64-7.03-5.46-4.73 7.19-.61L12 2l2.81 6.57 7.19.61-5.46 4.73 1.64 7.03z" />
        </svg>
      ))}
    </span>
  );
}

/* =========================================================
   Simple inline icons (no libs required)
========================================================= */

function IconCar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function IconId() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 7.5A2.5 2.5 0 0 1 7 5h10a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 17 19H7a2.5 2.5 0 0 1-2.5-2.5v-9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 15c.8-1.2 2-2 4-2s3.2.8 4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M10 10.2a2 2 0 1 0 4 0a2 2 0 0 0-4 0Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function IconGo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 8.5v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".35" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M7 8l5 4 5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l8 4v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V7l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L3 14h7l-1 8 12-14h-7l-1-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
