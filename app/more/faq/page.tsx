// app/more/faq/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  Shield,
  FileText,
  CreditCard,
  RefreshCw,
  Search,
  Car,
  Truck,
  GraduationCap,
  Building2,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   Types
========================================================= */

type FAQItem = {
  q: string;
  a: React.ReactNode;
  keywords?: string[];
};

type FAQSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
};

/* =========================================================
   Data (expanded + GoTempCover-relevant)
========================================================= */

const SECTIONS: readonly FAQSection[] = [
  {
    id: "cover",
    title: "Cover & timings",
    icon: <Clock className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "When does my cover start?",
        a: (
          <>
            Your cover starts at the exact start date and time you choose during your quote. Double-check the
            start time before checkout to avoid buying the wrong window.
          </>
        ),
        keywords: ["start", "start time", "begin", "when does it start"],
      },
      {
        q: "When does my cover end?",
        a: (
          <>
            Your cover ends at the exact end date and time you select. If you need longer cover, simply create
            a new quote for the extra time you need.
          </>
        ),
        keywords: ["end", "finish", "expiry", "expires"],
      },
      {
        q: "Can I choose exact start and end times (not just days)?",
        a: (
          <>
            Yes — you can set exact times (e.g. 14:15 to 18:45). This helps you avoid paying for time you
            don’t need.
          </>
        ),
        keywords: ["exact times", "hourly", "minutes"],
      },
      {
        q: "Can I start cover immediately?",
        a: (
          <>
            In most cases, yes — you can choose a start time close to “now”. If an insurer requires a short
            lead time, you’ll see that during the quote flow.
          </>
        ),
        keywords: ["start now", "immediately", "instant"],
      },
      {
        q: "Is temporary cover the same as annual insurance?",
        a: (
          <>
            No — temporary cover is designed for short windows (hours → days → weeks/months depending on
            availability). It’s ideal when you don’t need a full annual contract.
          </>
        ),
        keywords: ["annual", "difference", "temporary vs annual"],
      },
    ],
  },

  {
    id: "eligibility",
    title: "Eligibility & acceptance",
    icon: <Shield className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "Who can buy temporary insurance?",
        a: (
          <>
            Eligibility depends on the insurer’s underwriting rules. Common factors include age, licence type,
            driving history, and the vehicle itself. If something doesn’t match, you’ll usually see this during
            quote or checkout.
          </>
        ),
        keywords: ["eligible", "eligibility", "age", "licence"],
      },
      {
        q: "What licence types do you support?",
        a: (
          <>
            Typically UK full licences are supported. Some products may support international licences or
            learner-specific cover (where available). If a licence type isn’t supported for a product, we’ll make
            this clear in the quote journey.
          </>
        ),
        keywords: ["licence types", "uk", "international", "learner"],
      },
      {
        q: "Can I insure a car that isn’t registered to me?",
        a: (
          <>
            Often yes — temporary cover is commonly used for borrowing a car. You’ll still need to meet insurer
            requirements and have permission to use the vehicle.
          </>
        ),
        keywords: ["not my car", "borrow", "borrowed car"],
      },
      {
        q: "Do you cover business use for vans?",
        a: (
          <>
            It depends on the product. If you need business use, make sure the option you choose explicitly allows
            it. Always check your documents for the exact permitted use.
          </>
        ),
        keywords: ["business use", "van work", "hire and reward"],
      },
      {
        q: "Is everyone guaranteed to be accepted?",
        a: (
          <>
            No — insurance is always subject to underwriting and insurer acceptance. We’ll show you what’s available
            for your details as you go through the quote.
          </>
        ),
        keywords: ["guaranteed", "acceptance", "underwriting"],
      },
    ],
  },

  {
    id: "vehicle-lookup",
    title: "Vehicle lookup & details",
    icon: <Search className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "My reg lookup didn’t find my vehicle — what should I do?",
        a: (
          <>
            If lookup fails or returns partial data, you can enter your vehicle details manually and continue.
            This doesn’t automatically mean you can’t be insured — it just means we couldn’t prefill the details.
          </>
        ),
        keywords: ["lookup", "vehicle not found", "vrm", "registration"],
      },
      {
        q: "Why might my vehicle not appear in lookup?",
        a: (
          <>
            It can happen if the DVLA data is delayed, the plate is new, or the vehicle details are unusual.
            Manual entry is provided so you can still continue.
          </>
        ),
        keywords: ["dvla", "new plate", "not found"],
      },
      {
        q: "What if the lookup details are slightly wrong?",
        a: (
          <>
            Always correct any mismatches before purchase (make/model/body type). Your documents must match the
            insured vehicle and driver details for cover to be valid.
          </>
        ),
        keywords: ["wrong", "incorrect", "mismatch"],
      },
    ],
  },

  {
    id: "documents",
    title: "Documents & retrieval",
    icon: <FileText className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "How do I get my policy documents?",
        a: (
          <>
            After purchase, your documents are generated and sent to your email. You can also retrieve them later
            using your policy reference.
          </>
        ),
        keywords: ["documents", "certificate", "email"],
      },
      {
        q: "How do I retrieve my policy documents later?",
        a: (
          <>
            Use the <Link href="/retrieve-policy" className="a">Retrieve policy</Link> page and enter your details.
            You can re-download documents without creating an account.
          </>
        ),
        keywords: ["retrieve", "download", "policy number", "policy reference"],
      },
      {
        q: "What documents will I receive?",
        a: (
          <>
            Typically you’ll receive a certificate of insurance and supporting policy documents (such as terms,
            schedule, and key information). The exact set depends on the insurer/product.
          </>
        ),
        keywords: ["certificate", "schedule", "terms"],
      },
      {
        q: "Will my insurance show on the MID straight away?",
        a: (
          <>
            MID update times vary. Some policies may appear quickly, while others can take longer depending on the
            insurer’s process. Your official policy documents are the primary proof of cover.
          </>
        ),
        keywords: ["mid", "motor insurance database", "police"],
      },
      {
        q: "I didn’t receive my email — what should I do?",
        a: (
          <>
            First check junk/spam. If it’s not there, use{" "}
            <Link href="/retrieve-policy" className="a">Retrieve policy</Link> to access documents instantly. If you’re
            still stuck, contact <Link href="/help-support" className="a">Help &amp; Support</Link>.
          </>
        ),
        keywords: ["email not received", "spam", "junk"],
      },
    ],
  },

  {
    id: "payments",
    title: "Payments & checkout",
    icon: <CreditCard className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "When do I pay?",
        a: (
          <>
            You’ll see the full price before checkout. Payment is taken securely at checkout and your documents are
            issued after successful payment.
          </>
        ),
        keywords: ["pay", "payment", "checkout"],
      },
      {
        q: "Is VAT included in the displayed price?",
        a: (
          <>
            Where shown, prices are displayed as “incl. VAT”. You’ll see the final total clearly before confirming
            payment.
          </>
        ),
        keywords: ["vat", "tax", "included"],
      },
      {
        q: "Why did my payment fail?",
        a: (
          <>
            Common reasons include bank verification, insufficient funds, or security checks. Try again, use a different
            card, or contact your bank. If you need help, visit{" "}
            <Link href="/help-support" className="a">Help &amp; Support</Link>.
          </>
        ),
        keywords: ["failed", "declined", "3ds", "verification"],
      },
    ],
  },

  {
    id: "changes",
    title: "Changes, cancellations & refunds",
    icon: <RefreshCw className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "Can I change the start/end time after purchase?",
        a: (
          <>
            This depends on the policy terms. In many cases, changes aren’t possible once the policy is active. If you
            need different times, the safest approach is to purchase cover with the correct period.
          </>
        ),
        keywords: ["change", "amend", "edit", "times"],
      },
      {
        q: "Can I cancel my policy?",
        a: (
          <>
            Cancellation rules vary by insurer and may depend on whether the policy has started. If you need help, head
            to <Link href="/help-support" className="a">Help &amp; Support</Link>.
          </>
        ),
        keywords: ["cancel", "cancellation", "refund"],
      },
      {
        q: "Will I get a refund if I cancel?",
        a: (
          <>
            Refund eligibility depends on insurer terms (for example, whether cover has started and the product rules).
            You’ll find the exact rules in your documents.
          </>
        ),
        keywords: ["refund", "money back"],
      },
    ],
  },

  {
    id: "learner",
    title: "Learner cover",
    icon: <GraduationCap className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "Does learner cover require supervision?",
        a: (
          <>
            Yes — learner driving is generally supervised according to UK rules (e.g. a qualified supervisor).
            Your cover should be used alongside legal driving requirements.
          </>
        ),
        keywords: ["learner", "supervised", "supervision"],
      },
      {
        q: "Can I use learner cover in a family member’s car?",
        a: (
          <>
            Often yes, provided you meet insurer requirements and have permission. Make sure the vehicle and driver
            details are correct before purchase.
          </>
        ),
        keywords: ["family car", "parents car", "borrow"],
      },
    ],
  },

  {
    id: "vans",
    title: "Van cover",
    icon: <Truck className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "Can I use temporary van cover for moving house?",
        a: (
          <>
            Yes — it’s a common use case. Choose the start/end times you need and ensure the policy use matches your
            intended driving (e.g. social/domestic vs business use).
          </>
        ),
        keywords: ["move", "moving house", "van hire"],
      },
      {
        q: "Can I use temporary van cover for work?",
        a: (
          <>
            It depends on whether the policy includes business use. If business use is required, ensure you select a
            product that explicitly allows it and check the documents.
          </>
        ),
        keywords: ["work", "business use", "trades"],
      },
    ],
  },

  {
    id: "impound",
    title: "Impound cover",
    icon: <Building2 className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "What is impound insurance used for?",
        a: (
          <>
            Impound policies are typically used to help release a vehicle from an impound lot, where specific insurance
            requirements may apply. Always check the compound’s requirements for your situation.
          </>
        ),
        keywords: ["impound", "compound", "release"],
      },
      {
        q: "What documents might the compound ask for?",
        a: (
          <>
            Requirements vary, but may include proof of identity, proof of address, and valid insurance documents.
            Always confirm the exact checklist with the compound before attending.
          </>
        ),
        keywords: ["proof of address", "id", "documents"],
      },
    ],
  },

  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: <AlertTriangle className="h-5 w-5 text-sky-700" />,
    items: [
      {
        q: "My quote won’t load or looks stuck — what should I do?",
        a: (
          <>
            Refresh the page, check your internet connection, and try again. If the issue continues, try another browser
            or device. If you’re still stuck, contact{" "}
            <Link href="/help-support" className="a">Help &amp; Support</Link>.
          </>
        ),
        keywords: ["stuck", "loading", "not working"],
      },
      {
        q: "I entered a full registration and the button disappeared — why?",
        a: (
          <>
            We aim to keep actions visible at all times. If you notice a disappearing button, it’s usually a layout
            edge-case we’ll patch quickly — you can still proceed by scrolling slightly or resizing. If it persists,
            let support know what device/browser you’re using.
          </>
        ),
        keywords: ["button disappears", "layout", "mobile"],
      },
    ],
  },
] as const;

/* =========================================================
   Small UI
========================================================= */

function SectionHeader({
  title,
  icon,
  count,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-base font-extrabold tracking-tight text-slate-900">{title}</div>
          <div className="mt-0.5 text-[12px] text-slate-500">{count} questions</div>
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-extrabold text-slate-700">
        Browse
      </span>
    </div>
  );
}

function FAQItemRow({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 px-5 py-4 text-left hover:bg-slate-50 transition"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="text-[15px] sm:text-base font-extrabold tracking-tight text-slate-900">
            {q}
          </div>
        </div>
        <span
          className={[
            "mt-0.5 shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
          >
            <div className="pt-1">{a}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function GhostChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-extrabold transition border",
        active
          ? "border-slate-300 bg-slate-50 text-slate-900"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* =========================================================
   Page
========================================================= */

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("all");
  const [openMap, setOpenMap] = useState<Record<string, number | null>>({}); // sectionId -> open index

  const flatCount = useMemo(
    () => SECTIONS.reduce((sum, s) => sum + s.items.length, 0),
    []
  );

  const filteredSections = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const base = activeSection === "all"
      ? SECTIONS
      : SECTIONS.filter((s) => s.id === activeSection);

    if (!needle) return base;

    return base
      .map((s) => {
        const items = s.items.filter((it) => {
          const q = it.q.toLowerCase();
          const k = (it.keywords || []).join(" ").toLowerCase();
          return q.includes(needle) || k.includes(needle);
        });
        return { ...s, items };
      })
      .filter((s) => s.items.length > 0);
  }, [query, activeSection]);

  const totalResults = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.items.length, 0),
    [filteredSections]
  );

  return (
    <div className="bg-wash">
      <PageShell
        eyebrow="Resources"
        title="FAQs"
        subtitle="Simple, clear answers — written for real UK drivers buying temporary cover."
        crumbs={[{ label: "Home", href: "/" }, { label: "More", href: "/more" }, { label: "FAQs" }]}
        ctaLabel="Get a quote"
        ctaHref="/get-quote"
      >
        {/* HERO (minimal, premium) */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/10 via-blue-300/10 to-indigo-300/10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Clear answers for GoTempCover customers
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Frequently asked questions
              </h2>

              <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
                Everything you need to know about timings, eligibility, documents, payments and policy retrieval —
                kept short, accurate and easy to follow.
              </p>

{/* Search + filter row */}
<div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
  {/* Search */}
  <div className="w-full lg:max-w-[560px]">
    <div className="relative">
      {/* Magnifier */}
      <span
        className={[
          "pointer-events-none absolute right-6 top-1/2 -translate-y-1/2",
          "text-slate-400 transition-opacity",
          query.trim() ? "opacity-0" : "opacity-100",
        ].join(" ")}
        aria-hidden="true"
      >
        <Search size={18} />
      </span>

      {/* Input */}
      <input
        className="input pl-14 pr-4"
        placeholder="Search (e.g. start time, documents, cancel, MID)…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>

    <div className="mt-2 text-[12px] text-slate-500">
      {query.trim()
        ? `${totalResults} ${totalResults === 1 ? "result" : "results"}`
        : `${flatCount} questions`}
    </div>
  </div>

  {/* Actions */}
  <div className="flex flex-wrap gap-2">
    <Link href="/retrieve-policy" className="btn-ghost">
      Retrieve policy
    </Link>
    <Link href="/help-support" className="btn-ghost">
      Help &amp; Support
    </Link>
  </div>
</div>


              {/* Section chips (ghost/light, not dark) */}
              <div className="mt-5 flex flex-wrap gap-2">
                <GhostChip active={activeSection === "all"} onClick={() => setActiveSection("all")}>
                  All
                </GhostChip>
                {SECTIONS.map((s) => (
                  <GhostChip
                    key={s.id}
                    active={activeSection === s.id}
                    onClick={() => setActiveSection(s.id)}
                  >
                    {s.title}
                  </GhostChip>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-10 space-y-10">
          {filteredSections.map((section, idx) => {
            const openIndex = openMap[section.id] ?? null;

            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm"
              >
                <SectionHeader
                  title={section.title}
                  icon={section.icon}
                  count={section.items.length}
                />

                <div className="mt-5 grid gap-3">
                  {section.items.map((item, i) => (
                    <FAQItemRow
                      key={`${section.id}-${i}`}
                      q={item.q}
                      a={item.a}
                      open={openIndex === i}
                      onToggle={() =>
                        setOpenMap((prev) => ({
                          ...prev,
                          [section.id]: prev[section.id] === i ? null : i,
                        }))
                      }
                    />
                  ))}
                </div>
              </motion.section>
            );
          })}

          {filteredSections.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">No results</div>
              <p className="mt-2 text-sm text-slate-600">
                Try a different keyword (e.g. “documents”, “start time”, “cancel”, “impound”) or switch sections.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["documents", "start time", "cancel", "impound", "MID"].map((t) => (
                  <button key={t} className="btn-ghost" type="button" onClick={() => setQuery(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom CTA (simple, premium) */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">Still need help?</div>
              <p className="mt-1 text-sm text-slate-600">
                Our team can help with quotes, documents and policy retrieval.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/help-support" className="btn-ghost">
                Help &amp; Support
              </Link>
              <Link href="/retrieve-policy" className="btn-ghost">
                Retrieve policy
              </Link>
              <Link href="/get-quote" className="btn-primary">
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
