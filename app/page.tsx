/* /app/page.tsx */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import QuoteWidget from "@/components/quote/QuoteWidget";

/* =========================================================
   GoTempCover — Homepage (50k polish pass)
   - Keeps your current layout exactly (How it works left, image only under quote)
   - Premium rhythm + alignment + micro-accessibility
   - Reduced-motion friendly (no hover scaling/parallax when reduced)
   - Image card feels intentional (taller aspect + matched shadow language)
   - Cleaner separation between chips -> how it works
========================================================= */

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay: d },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: easeOut, delay: d },
  }),
};

const complianceLine =
  "Eligibility, underwriting and acceptance apply. You’ll review details before payment.";

const HERO_CHIPS = [
  "Borrowing a car",
  "Learner practice",
  "Short-term van use",
  "Cover needed today",
] as const;

const PROOF = [
  { title: "Exact start & end times", desc: "Choose precisely when your cover begins and ends.", dot: "bg-indigo-500" },
  { title: "Secure checkout", desc: "Pay safely using our encrypted online checkout.", dot: "bg-blue-500" },
  { title: "Instant documents", desc: "Certificate and policy documents issued immediately after purchase.", dot: "bg-emerald-500" },
] as const;

const PRODUCT_LINKS = [
  { href: "/car", label: "Car cover" },
  { href: "/van", label: "Van cover" },
  { href: "/learner", label: "Learner cover" },
  { href: "/impound", label: "Impound cover" },
] as const;

const TRUST_ROWS = [
  "Transparent journey — review before you pay",
  "Documents issued instantly after purchase and emailed",
  "Support available when you need it (Mon–Sat)",
] as const;

const HELP_TOPICS = [
  "How to retrieve documents using your policy reference",
  "Changing cover dates before purchase",
  "Vehicle not found — entering details manually",
  "Eligibility and insurer acceptance",
] as const;

const FAQS = [
  {
    q: "How quickly can I get covered?",
    a: "Most customers complete the quote journey in a few minutes. After payment, your documents are issued instantly and sent to your email.",
  },
  {
    q: "What do I need to get a quote?",
    a: "Your vehicle registration, your cover dates/times, and your basic driver details. If lookup can’t find your vehicle, you can enter make/model manually.",
  },
  {
    q: "Can I choose an exact start time?",
    a: "Yes — you pick the exact start and end time. If you’re starting immediately, use Start now to select a convenient time.",
  },
  {
    q: "How do I retrieve my policy documents later?",
    a: "Use Retrieve policy in the header or footer. You can access documents using your details or policy reference.",
  },
  {
    q: "Is everyone eligible?",
    a: "Eligibility depends on driver and vehicle details, underwriting rules, and acceptance by the insurer. You’ll see what’s available as you progress.",
  },
] as const;

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen text-slate-900">
      {/* a11y: skip link */}
      <a
        href="#quote"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg focus:ring-4 focus:ring-blue-200/60"
      >
        Skip to quote
      </a>

      <main className="bg-wash">
        <StickyMiniCta />

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-400/10 via-blue-300/10 to-indigo-300/10 animate-gradient" />
          <ParallaxTexture />
          <AuroraOrbs />

          <div className="relative z-10 container-app pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-14">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              {/* Left */}
              <div className="min-w-0">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.02}
                  className="inline-flex items-center gap-2 rounded-full bg-white/75 border border-slate-200 px-4 py-1.5 text-[12px] text-slate-600 shadow-sm backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Help available when it matters
                </motion.div>

                <motion.h1
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.08}
                  className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.06]"
                >
                  Temporary insurance cover,{" "}
                  <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
                    made simple
                  </span>
                  .
                </motion.h1>

                <motion.p
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.14}
                  className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
                >
                  Choose your cover window to the minute. Review your details, see a clear price, then pay securely.
                  Your Certificate and documents are issued instantly after purchase and emailed to you.
                </motion.p>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.18}
                  className="mt-7 flex flex-col sm:flex-row gap-3"
                >
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <Link className="btn-primary w-full sm:w-auto" href="#quote">
                      Start a quote
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <Link className="btn-ghost w-full sm:w-auto" href="/retrieve-policy">
                      Retrieve policy
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.22}
                  className="mt-7 grid gap-3 sm:grid-cols-3 max-w-xl"
                >
                  {PROOF.map((p) => (
                    <ProofCard key={p.title} title={p.title} desc={p.desc} dot={p.dot} />
                  ))}
                </motion.div>

                <div className="mt-6 text-[12px] text-slate-500 max-w-xl">{complianceLine}</div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeIn}
                  custom={0.26}
                  className="mt-6 flex flex-wrap gap-2 max-w-xl"
                >
                  {HERO_CHIPS.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </motion.div>

                {/* premium separator: chips -> how it works */}
                <div className="mt-5 h-px w-full max-w-xl bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* How it works panel (under the chips) */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  custom={0.3}
                  className="mt-5"
                  id="how"
                >
                  <HowItWorksPanel />
                </motion.div>
              </div>

              {/* Right: Quote + Hero Image */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0.12}
                id="quote"
                className="scroll-mt-24"
              >
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-6 sm:p-7">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-12 rounded-t-3xl bg-gradient-to-b from-sky-100/60 to-transparent" />
                  <div className="relative">
                    <QuoteWidget />
                  </div>
                </div>

                {/* image only (as you want) */}
                <HeroImageCard />
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST / WHY */}
        <section className="section">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    Built like a proper insurer journey
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                    Clear timing, clear pricing, and documents you can actually find when you need them. No messy
                    steps, no guesswork.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Pill icon={<IconShield />}>Secure checkout</Pill>
                    <Pill icon={<IconClock />}>Exact times</Pill>
                    <Pill icon={<IconDoc />}>Instant documents</Pill>
                    <Pill icon={<IconSearch />}>Easy retrieval</Pill>
                  </div>

                  <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">Straightforward</div>
                        <p className="mt-1 text-sm text-slate-600">{complianceLine}</p>
                      </div>
                      <span className="badge">Clear</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-[13px] text-slate-700">
                      {TRUST_ROWS.map((t) => (
                        <TrustRow key={t} text={t} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keep ONE “Confidence” panel */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                        Confidence
                      </div>
                      <div className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900">
                        Clear cover, fast documents
                      </div>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        Set your window precisely. After purchase, documents are issued instantly and emailed.
                      </p>
                    </div>
                    <span className="badge">Premium</span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <MiniStat label="Quote" value="Clear pricing" />
                    <MiniStat label="Documents" value="Instant" />
                    <MiniStat label="Policy Access" value="Self-serve" />
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link className="btn-primary justify-center" href="#quote">
                      Start a quote
                    </Link>
                    <Link className="btn-ghost justify-center" href="/retrieve-policy">
                      Retrieve policy
                    </Link>
                  </div>

                  <div className="mt-4 text-[12px] text-slate-500">
                    Underwriting rules and insurer acceptance apply.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="section">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  A clean quote journey
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  From registration to documents — in four clear steps.
                </p>
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-4">
                <StepCard
                  n={1}
                  title="Vehicle"
                  desc="Enter your registration and confirm vehicle details."
                  icon={<IconCar />}
                />
                <StepCard n={2} title="Driver" desc="Add your details so quotes are personalised." icon={<IconId />} />
                <StepCard n={3} title="Options" desc="Pick the best-value option for your cover period." icon={<IconBolt />} />
                <StepCard
                  n={4}
                  title="Documents"
                  desc="Pay securely — documents issued instantly after purchase."
                  icon={<IconDoc />}
                />
              </div>

              <div className="mt-10 flex justify-center">
                <Link href="#quote" className="btn-primary">
                  Start a quote
                </Link>
              </div>

              <div className="mt-4 text-center text-[12px] text-slate-500">{complianceLine}</div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="section">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Need help?</h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                    We can help with quotes, documents and policy retrieval.
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Help topics</div>
                      <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Quick answers</div>
                    </div>
                    <span className="badge">Support</span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-700">
                    {HELP_TOPICS.map((t) => (
                      <Reason key={t} text={t} />
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-extrabold text-slate-900">Already purchased cover?</div>
                    <p className="mt-1 text-sm text-slate-600">Retrieve your Certificate and policy documents anytime.</p>
                    <Link className="btn-primary mt-4 justify-center w-full" href="/retrieve-policy">
                      Retrieve policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
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
                {FAQS.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="#quote" className="btn-primary justify-center">
                  Start a quote
                </Link>
                <Link href="/retrieve-policy" className="btn-ghost justify-center">
                  Retrieve policy
                </Link>
              </div>

              <div className="mt-8 flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
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
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section">
          <div className="container-app">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Ready when you are.</h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
                    Start in seconds. Confirm details, pick the best-value option for your period, then pay securely.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link className="btn-primary justify-center" href="#quote">
                      Start a quote
                    </Link>
                    <Link className="btn-ghost justify-center" href="/retrieve-policy">
                      Retrieve policy
                    </Link>
                  </div>

                  <div className="mt-4 text-[12px] text-slate-500">{complianceLine}</div>
                </div>

                <div className="rounded-2xl bg-slate-50/70 border border-slate-200 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-extrabold text-slate-900">Popular reasons</div>
                    <span className="badge">Common</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-700">
                    <Reason text="Borrowing a car for the day" />
                    <Reason text="Short-term van use for work or moving" />
                    <Reason text="Learner driving practice" />
                    <Reason text="Cover needed quickly for a specific time window" />
                  </div>

                  <div className="mt-4 text-[12px] text-slate-500">
                    Tip: Have your reg and dates ready — most people finish in a few minutes.
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 260);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-40",
        "bg-white/90 backdrop-blur-md border-b border-slate-200/70",
        "transition-all duration-500",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full",
        reduceMotion ? "transition-none" : "",
      ].join(" ")}
      role="region"
      aria-label="Quick quote bar"
    >
      <div className="container-app py-2.5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-extrabold text-slate-900">GoTempCover</div>
          <div className="text-[11px] text-slate-500 truncate">Temporary motor cover, without the hassle</div>
        </div>
        <Link href="#quote" className="btn-primary text-xs" aria-label="Start a quote">
          Start quote
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
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

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

function AuroraOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-emerald-200/12 blur-3xl" />
    </div>
  );
}

/* =========================================================
   Hero image card (under quote)
========================================================= */

function HeroImageCard() {
  return (
    <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
      <div className="relative aspect-[16/12] w-full">
        <Image
          src="/images/hero-car.jpg"
          alt="Car driving in city — GoTempCover temporary insurance"
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/* =========================================================
   How it works panel
========================================================= */

function HowItWorksPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">How it works</div>
          <h2 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Clear steps. Clear price. Clear documents.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Built for quick, time-boxed cover — without the usual confusion around dates and documents.
          </p>
        </div>
        <span className="badge">Simple</span>
      </div>

      <div className="mt-6 grid gap-3">
        <Benefit text="Enter your reg and confirm your vehicle" />
        <Benefit text="Choose exact start and end time" />
        <Benefit text="Select the best-value option for your period" />
        <Benefit text="Pay securely — documents issued instantly" />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {PRODUCT_LINKS.map((p) => (
          <Link key={p.href} className="btn-ghost justify-center" href={p.href}>
            {p.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-extrabold text-slate-900">Good to know</div>
          <span className="badge">UK</span>
        </div>
        <div className="mt-2 text-[13px] text-slate-700 leading-relaxed">
          Always check your Certificate of Motor Insurance and policy documents before driving. Cover is subject to
          eligibility and acceptance.
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Small UI bits
========================================================= */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 backdrop-blur px-3 py-1.5 text-[12px] font-semibold text-slate-700">
      {children}
    </span>
  );
}

function ProofCard({ title, desc, dot }: { title: string; desc: string; dot: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <div className="text-[12px] font-extrabold text-slate-900">{title}</div>
      </div>
      <div className="mt-1 text-[12px] text-slate-600">{desc}</div>
    </div>
  );
}

const Benefit = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 h-6 w-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
      ✓
    </span>
    <div className="text-sm text-slate-700">{text}</div>
  </div>
);

function StepCard({ n, title, desc, icon }: { n: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm">
        {icon}
      </div>
      <div className="mt-5 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-base font-extrabold text-slate-900">{value}</div>
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
      <div className="grid grid-cols-[1fr_auto_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
          <div className="mt-1 text-base font-extrabold text-slate-900 break-words">{value}</div>
          {helper ? <div className="mt-1 text-[12px] text-slate-500">{helper}</div> : null}
        </div>

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
    <a href={href} className="block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200/60">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

/* =========================================================
   Inline icons (no libs required)
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
      <path d="M8 15c.8-1.2 2-2 4-2s3.2.8 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
