"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";

type FormState = {
  name: string;
  email: string;
  topic: "General" | "Documents" | "Policy retrieval" | "Quote issue" | "Eligibility" | "Other";
  policyRef: string;
  message: string;
  // Honeypot (anti-bot)
  website: string;
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

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

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames("rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200", className)}>
      {children}
    </div>
  );
}

function InfoRow({
  title,
  value,
  helper,
  icon,
  href,
}: {
  title: string;
  value: string;
  helper?: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const inner = (
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

  if (!href) return inner;

  return (
    <a
      href={href}
      className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 rounded-2xl"
    >
      {inner}
    </a>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={classNames(
        "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-300",
        props.className
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={classNames(
        "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-300",
        props.className
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={classNames(
        "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm",
        "focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-300",
        props.className
      )}
    />
  );
}

function TrustStrip() {
  const items = ["Fast responses", "Clear next steps", "Instant document retrieval"];
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

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function ContactPage() {
  const SUPPORT_EMAIL = "support@gotempcover.com";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    topic: "General",
    policyRef: "",
    message: "",
    website: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!isEmail(form.email)) e.email = "Please enter a valid email.";
    if (!form.message.trim() || form.message.trim().length < 12) e.message = "Please add a little more detail.";
    return e;
  }, [form]);

  const canSend = status !== "sending" && Object.keys(errors).length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // bot trap
    if (form.website.trim()) {
      setStatus("sent");
      return;
    }

    if (!canSend) {
      setStatus("error");
      setErrorMsg("Please check the form — a couple of fields still need attention.");
      return;
    }

    setStatus("sending");

    // If you later build /api/contact, this will use it automatically.
    // For now, we fall back to mailto so nothing breaks.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }
      // If route doesn't exist, Next will 404 — we'll fall back
      throw new Error("No API route yet");
    } catch {
      const subject = encodeURIComponent(`[GoTempCover] ${form.topic} — ${form.name}`);
      const lines = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Topic: ${form.topic}`,
        form.policyRef.trim() ? `Policy reference: ${form.policyRef.trim()}` : "",
        "",
        form.message.trim(),
      ].filter(Boolean);

      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }
  }

  return (
    <div className="bg-wash">
      <PageShell
        eyebrow="Support"
        title="Contact"
        subtitle="Fast, clear help — with the right next step the first time."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        ctaLabel="Retrieve policy"
        ctaHref="/retrieve-policy"
      >
        {/* HERO */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/12 via-blue-300/10 to-indigo-300/10" />
            <div className="relative grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
                  <AccentDot />
                  Premium support • No runaround
                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Tell us what you need — we’ll guide you.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  Use the form for questions about documents, retrieval, timings, eligibility, or anything that looks
                  incorrect. If you already purchased, have your policy reference ready.
                </p>

                <TrustStrip />

                <div className="mt-5 flex flex-wrap gap-2">
                  <SoftChip>Mon–Sat, 9am–5pm</SoftChip>
                  <SoftChip>Reply within 1 business day</SoftChip>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    Before you message
                  </div>

                  <div className="mt-3 grid gap-3">
                    <Link href="/retrieve-policy" className="btn-primary w-full justify-center">
                      Retrieve policy documents
                    </Link>
                    <Link href="/help-support" className="btn-ghost w-full justify-center">
                      Help &amp; Support
                    </Link>
                    <Link href="/more/faq" className="btn-ghost w-full justify-center">
                      FAQs
                    </Link>

                    <div className="text-center text-[12px] text-slate-500">
                      Most issues are resolved instantly via retrieval.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid gap-4 lg:grid-cols-6">
          {/* Form */}
          <CardShell className="lg:col-span-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">Send a message</div>
                <p className="mt-2 text-sm text-slate-600">
                  We’ll reply by email. Include a policy reference if you already purchased.
                </p>
              </div>
              <SoftChip>Secure</SoftChip>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              {/* Honeypot */}
              <input
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name ? <div className="mt-2 text-[12px] text-rose-600">{errors.name}</div> : null}
                </div>

                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    aria-invalid={!!errors.email}
                    inputMode="email"
                    autoComplete="email"
                  />
                  {errors.email ? <div className="mt-2 text-[12px] text-rose-600">{errors.email}</div> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[.9fr_1.1fr]">
                <div>
                  <FieldLabel htmlFor="topic">Topic</FieldLabel>
                  <Select
                    id="topic"
                    value={form.topic}
                    onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value as FormState["topic"] }))}
                  >
                    <option value="General">General</option>
                    <option value="Documents">Documents</option>
                    <option value="Policy retrieval">Policy retrieval</option>
                    <option value="Quote issue">Quote issue</option>
                    <option value="Eligibility">Eligibility</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div>
                  <FieldLabel htmlFor="policyRef">Policy reference (optional)</FieldLabel>
                  <Input
                    id="policyRef"
                    placeholder="e.g. GTC-123456"
                    value={form.policyRef}
                    onChange={(e) => setForm((p) => ({ ...p, policyRef: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Tell us what happened, what you were trying to do, and what you expected to see."
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                />
                {errors.message ? <div className="mt-2 text-[12px] text-rose-600">{errors.message}</div> : null}
                <div className="mt-2 text-[12px] text-slate-500">
                  Tip: include device/browser if something looked broken.
                </div>
              </div>

              {errorMsg ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              ) : null}

              {status === "sent" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Sent — if a mail client opened, just hit send. If not, you can email us directly at{" "}
                  <a className="a" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={!canSend}
                  className={classNames(
                    "btn-primary inline-flex justify-center",
                    !canSend && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                <div className="text-[12px] text-slate-500">
                  By contacting us, you agree we can reply by email.
                </div>
              </div>
            </form>
          </CardShell>

          {/* Contact cards */}
          <CardShell className="lg:col-span-2">
            <div className="text-sm font-extrabold text-slate-900">Direct contact</div>
            <p className="mt-2 text-sm text-slate-600">
              For documents, retrieval and general support.
            </p>

            <div className="mt-5 grid gap-3">
              <InfoRow
                title="Email"
                value="support@gotempcover.com"
                helper="We usually reply within one business day."
                icon={<IconMail />}
                href="mailto:support@gotempcover.com"
              />
              <InfoRow
                title="Opening hours"
                value="Mon–Sat, 9am–5pm"
                helper="Closed Sundays & bank holidays."
                icon={<IconClock />}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4">
              <div className="text-[12px] font-extrabold text-slate-900">Shortcuts</div>
              <div className="mt-3 grid gap-2">
                <Link href="/retrieve-policy" className="btn-ghost w-full justify-center">
                  Retrieve policy
                </Link>
                <Link href="/more/faq" className="btn-ghost w-full justify-center">
                  FAQs
                </Link>
                <Link href="/help-support" className="btn-ghost w-full justify-center">
                  Help &amp; Support
                </Link>
              </div>
            </div>

            <div className="mt-6 text-[12px] text-slate-500">
              Note: if you haven’t purchased yet, the fastest route is to start a quote and review your details before
              payment.
            </div>

            <div className="mt-3">
              <Link href="/get-quote" className="btn-ghost w-full justify-center">
                Start a quote
              </Link>
            </div>
          </CardShell>
        </div>

        {/* Bottom reassurance */}
        <div className="mt-10 rounded-[28px] bg-white/75 backdrop-blur p-6 ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">Already bought cover?</div>
              <p className="mt-1 text-sm text-slate-600">
                Retrieval is instant and avoids waiting for a reply.
              </p>
            </div>
            <Link href="/retrieve-policy" className="btn-primary inline-flex justify-center">
              Retrieve policy documents
            </Link>
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
