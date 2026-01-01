// app/more/blog/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";

type BlogCategory = "All" | "Temporary cover" | "Learners" | "Vans" | "Impound" | "Guides";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<BlogCategory, "All">;
  readMins: number;
  dateLabel: string; // label only (no backend yet)
  featured?: boolean;
};

const POSTS: readonly Post[] = [
  {
    slug: "how-temp-car-insurance-works",
    title: "How temporary car insurance works (and when it’s worth it)",
    excerpt:
      "A clear breakdown of what temporary cover is, who it’s for, and how to choose the right start and end times.",
    category: "Temporary cover",
    readMins: 4,
    dateLabel: "Updated recently",
    featured: true,
  },
  {
    slug: "hourly-vs-daily-cover",
    title: "Hourly vs daily cover: choosing the best value",
    excerpt:
      "When hourly is cheaper, when daily makes more sense, and how to avoid paying for time you don’t need.",
    category: "Temporary cover",
    readMins: 3,
    dateLabel: "New",
  },
  {
    slug: "learner-insurance-basics",
    title: "Learner insurance: the essentials for supervised practice",
    excerpt:
      "What learner cover typically requires, what to prepare before you start, and how to keep everything simple.",
    category: "Learners",
    readMins: 5,
    dateLabel: "Popular",
  },
  {
    slug: "temporary-van-cover-for-moves",
    title: "Temporary van cover for moves and short jobs",
    excerpt:
      "A practical guide for van borrowing, moving house, or short-term work use — plus common pitfalls to avoid.",
    category: "Vans",
    readMins: 4,
    dateLabel: "Popular",
  },
  {
    slug: "impound-insurance-checklist",
    title: "Impound insurance checklist: what you may need to release your vehicle",
    excerpt:
      "A step-by-step checklist to help you prepare, understand requirements, and retrieve documents quickly.",
    category: "Impound",
    readMins: 6,
    dateLabel: "Essential",
  },
  {
    slug: "retrieve-policy-documents",
    title: "How to retrieve your policy documents quickly",
    excerpt:
      "Where to find your policy number, what to do if you can’t locate it, and how retrieval works.",
    category: "Guides",
    readMins: 3,
    dateLabel: "Quick read",
  },
] as const;

/* =========================================================
   UI bits
========================================================= */

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 px-3 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function AccentTop({ accent }: { accent: "blue" | "sky" | "indigo" }) {
  const map: Record<string, string> = {
    blue: "from-blue-600/85 via-sky-500/70 to-transparent",
    sky: "from-sky-500/85 via-blue-600/60 to-transparent",
    indigo: "from-indigo-600/85 via-blue-600/60 to-transparent",
  };
  return (
    <div
      aria-hidden="true"
      className={[
        "absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r",
        map[accent],
      ].join(" ")}
    />
  );
}

function CategoryChip({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: BlogCategory;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-[12px] font-extrabold transition",
        "border",
        active
          ? "border-slate-300 bg-slate-50 text-slate-900"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full transition",
          active ? "bg-emerald-500" : "bg-slate-300",
        ].join(" ")}
        aria-hidden="true"
      />
      {label}
    </button>
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
    <div
      className={[
        "relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ComingSoonBanner() {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/12 via-blue-300/10 to-indigo-300/10" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              Blog launch
            </div>
            <div className="mt-1 text-base font-extrabold text-slate-900">
              We’re publishing the full library soon
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              This page is live as a preview. Article pages will be added next — until then, you can
              browse topics and jump into quotes, guides and support.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Preview mode
          </span>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <Link href="/get-quote" className="btn-primary">
            Get a quote
          </Link>
          <Link href="/help-support" className="btn-ghost">
            Help & Support
          </Link>
          <Link href="/retrieve-policy" className="btn-ghost">
            Retrieve a policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function DisabledReadButton() {
  // Secondary button must be ghost/light (site rule)
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-xl px-4 py-3 text-sm font-extrabold",
        "border border-slate-200 bg-white text-slate-700",
        "opacity-60 cursor-not-allowed select-none",
      ].join(" ")}
      aria-disabled="true"
      title="Article pages are launching soon"
    >
      Read article
    </span>
  );
}

export default function BlogPage() {
  const [cat, setCat] = useState<BlogCategory>("All");

  const categories: BlogCategory[] = [
    "All",
    "Temporary cover",
    "Learners",
    "Vans",
    "Impound",
    "Guides",
  ];

  const featured = useMemo(() => POSTS.find((p) => p.featured) ?? POSTS[0], []);
  const filtered = useMemo(() => {
    const list = POSTS.filter((p) => !p.featured);
    if (cat === "All") return list;
    return list.filter((p) => p.category === cat);
  }, [cat]);

  return (
    <div className="bg-wash">
      <PageShell
        eyebrow="Resources"
        title="Blog"
        subtitle="Insights, updates and clear breakdowns to help you choose the right cover."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "More", href: "/more" },
          { label: "Blog" },
        ]}
        ctaLabel="Get a quote"
        ctaHref="/get-quote"
      >
        {/* COMING SOON / PREVIEW HERO */}
        <ComingSoonBanner />

        {/* HERO */}
        <div className="mt-6 rounded-[28px] bg-white/75 backdrop-blur p-5 sm:p-6 ring-1 ring-slate-200/70">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Editorial • Short reads • Practical guidance
              </div>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Everything you need to understand temporary cover
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                We keep this simple: what the cover is, how to choose the right duration, and what to do next.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <CategoryChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED + SIDEBAR */}
        <div className="mt-6 grid gap-4 lg:grid-cols-6">
          <CardShell className="lg:col-span-4">
            <AccentTop accent="blue" />

            <div className="pt-1 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SoftChip>Featured</SoftChip>
                  <SoftChip>{featured.category}</SoftChip>
                  <span className="text-[12px] text-slate-500">{featured.dateLabel}</span>
                  <span className="text-[12px] text-slate-400">•</span>
                  <span className="text-[12px] text-slate-500">{featured.readMins} min read</span>
                </div>

                <div className="mt-3 text-lg font-extrabold tracking-tight text-slate-900">
                  {featured.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{featured.excerpt}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <DisabledReadButton />
              <div className="text-[12px] text-slate-500">
                Article pages are publishing soon — this is a preview layout.
              </div>
            </div>
          </CardShell>

          <CardShell className="lg:col-span-2">
            <AccentTop accent="sky" />

            <div className="pt-1 text-sm font-extrabold text-slate-900">Most read topics</div>
            <p className="mt-2 text-sm text-slate-600">
              Quick starting points based on common questions.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                { t: "How cover timings work", href: "/get-quote" },
                { t: "Learner practice cover", href: "/learner" },
                { t: "Van cover for moves", href: "/van" },
                { t: "Retrieve documents", href: "/retrieve-policy" },
              ].map((x) => (
                <Link
                  key={x.t}
                  href={x.href}
                  className="group flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  <span className="text-sm font-semibold text-slate-900">{x.t}</span>
                  <span
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <div className="text-[12px] font-extrabold text-slate-900">Tip</div>
              <div className="mt-1 text-[12px] text-slate-600">
                If you already bought cover, you can retrieve your documents instantly.
              </div>
              <div className="mt-3">
                <Link href="/retrieve-policy" className="btn-ghost w-full justify-center">
                  Retrieve policy
                </Link>
              </div>
            </div>
          </CardShell>
        </div>

        {/* GRID */}
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Articles
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">
                {cat === "All" ? "Preview posts" : `Category: ${cat}`}
              </div>
            </div>
            <div className="text-[12px] text-slate-500">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div
                key={p.slug}
                className={[
                  "group relative h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200",
                  "transition hover:ring-slate-300 hover:shadow-[0_14px_40px_-24px_rgba(2,6,23,0.35)]",
                  "flex flex-col",
                ].join(" ")}
              >
                <AccentTop accent="indigo" />

                <div className="pt-1 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <SoftChip>{p.category}</SoftChip>
                      <span className="text-[12px] text-slate-500">{p.dateLabel}</span>
                      <span className="text-[12px] text-slate-400">•</span>
                      <span className="text-[12px] text-slate-500">{p.readMins} min</span>
                    </div>

                    <div className="mt-3 text-sm font-extrabold text-slate-900">{p.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">Coming soon</span>
                  <span className="text-[12px] text-slate-500">Preview</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA wash */}
          <div className="mt-10 rounded-[28px] bg-white/75 backdrop-blur p-5 sm:p-6 ring-1 ring-slate-200/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">Ready to get covered?</div>
                <p className="mt-1 text-sm text-slate-600">
                  Choose exact start and end times and head to secure checkout.
                </p>
              </div>
              <Link href="/get-quote" className="btn-primary inline-flex">
                Get a quote
              </Link>
            </div>
          </div>

          {/* Compliance-friendly reassurance */}
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
      </PageShell>
    </div>
  );
}
