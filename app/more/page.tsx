"use client";

// app/more/page.tsx
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import React from "react";

/* =========================================================
   Data
========================================================= */

type Tile = {
  title: string;
  desc: string;
  href: string;
  tag: string;
  icon: React.ReactNode;
  bullets: readonly string[];
  status?: "live" | "soon";
  accent?: "blue" | "sky" | "indigo";
};

const tiles: readonly Tile[] = [
  {
    title: "FAQs",
    desc: "Clear answers on cover, eligibility, documents and timings.",
    href: "/more/faq",
    tag: "FAQs",
    icon: <IconSpark />,
    bullets: ["Eligibility & underwriting", "Documents & retrieval", "Payments & timings"],
    status: "live",
    accent: "blue",
  },
  {
    title: "Guides",
    desc: "Step-by-step help for learners, vans, impound and temporary cover.",
    href: "/more/guides",
    tag: "Guides",
    icon: <IconMap />,
    bullets: ["Learner journeys", "Impound checklists", "Short-term use cases"],
    status: "soon",
    accent: "sky",
  },
  {
    title: "Blog",
    desc: "Insights, updates and helpful breakdowns (great for SEO).",
    href: "/more/blog",
    tag: "Insights",
    icon: <IconDoc />,
    bullets: ["Explainers", "Updates", "Seasonal tips"],
    status: "soon",
    accent: "indigo",
  },
] as const;

const browseByProduct = [
  { t: "Car cover", href: "/car" },
  { t: "Van cover", href: "/van" },
  { t: "Learner cover", href: "/learner" },
  { t: "Impound cover", href: "/impound" },
] as const;

const quickLinks = [
  { t: "Help & Support", href: "/help-support" },
  { t: "Retrieve a policy", href: "/retrieve-policy" },
  { t: "Start a quote", href: "/get-quote" },
] as const;

/* =========================================================
   UI bits
========================================================= */

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-8 px-3 rounded-full",
        "text-[12px] font-extrabold",
        "border border-slate-200 bg-white/80 backdrop-blur",
        "text-slate-700 shadow-sm",
      ].join(" ")}
    >
      {children}
    </span>
  );
}


function SectionHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
          {eyebrow}
        </div>
        <div className="mt-1 text-sm font-extrabold text-slate-900">{title}</div>
      </div>
      {right ? <div className="text-[12px] text-slate-500">{right}</div> : null}
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
    <div
      className={[
        "h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function AccentTop({ accent }: { accent: Tile["accent"] }) {
  const map: Record<string, string> = {
    blue: "from-blue-600/80 via-sky-500/70 to-transparent",
    sky: "from-sky-500/80 via-blue-600/60 to-transparent",
    indigo: "from-indigo-600/80 via-blue-600/60 to-transparent",
  };
  return (
    <div
      aria-hidden="true"
      className={[
        "absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r",
        map[accent || "blue"],
      ].join(" ")}
    />
  );
}

function IconBadge({
  accent = "blue",
  children,
}: {
  accent?: "blue" | "sky" | "indigo";
  children: React.ReactNode;
}) {
  // Hard gradients so badge NEVER looks blank/white
  const map: Record<string, string> = {
    blue: "bg-gradient-to-br from-blue-700 to-sky-500 shadow-blue-900/10",
    sky: "bg-gradient-to-br from-sky-500 to-blue-700 shadow-blue-900/10",
    indigo: "bg-gradient-to-br from-indigo-700 to-blue-700 shadow-indigo-900/10",
  };

  return (
    <span
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm",
        map[accent],
      ].join(" ")}
    >
      {/* Force icon to white regardless of SVG implementation */}
      <span className="text-white">{children}</span>
    </span>
  );
}

function TileCard({
  title,
  desc,
  href,
  tag,
  icon,
  bullets,
  status = "live",
  accent = "blue",
}: {
  title: string;
  desc: string;
  href: string;
  tag: string;
  icon: React.ReactNode;
  bullets: readonly string[];
  status?: "live" | "soon";
  accent?: "blue" | "sky" | "indigo";
}) {
  // Keep hub clean: NO "coming soon" panel here.
  // But pass a flag so /more/blog and /more/guides can show Coming Soon hero/cards.
  const safeHref = status === "soon" ? `${href}?comingSoon=1` : href;

  return (
    <Link
      href={safeHref}
      className={[
        "group relative h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 flex flex-col overflow-hidden",
        "transition hover:ring-slate-300 hover:shadow-[0_16px_44px_-26px_rgba(2,6,23,0.45)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200",
      ].join(" ")}
    >
      <AccentTop accent={accent} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <IconBadge accent={accent}>{icon}</IconBadge>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">{title}</div>
              <div className="mt-0.5 text-[12px] text-slate-500">Open</div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>

        <SoftChip>{tag}</SoftChip>
      </div>

      <div className="mt-5 grid gap-2 text-[12px] text-slate-700">
        {bullets.slice(0, 3).map((b) => (
          <div key={b} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="leading-snug">{b}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-900">
            Explore
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </div>
          <span className="text-[12px] font-semibold text-slate-500">Open</span>
        </div>

        <div className="mt-1 text-[12px] text-slate-500">Articles and quick answers</div>
      </div>
    </Link>
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
  // Grid layout prevents icon squish
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </div>
          <div className="mt-1 text-base font-extrabold text-slate-900 break-words">
            {value}
          </div>
          {helper ? <div className="mt-1 text-[12px] text-slate-500">{helper}</div> : null}
        </div>
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

export default function MoreHubPage() {
  return (
    <div className="bg-wash">
      <PageShell
        eyebrow="Resources"
        title="More"
        subtitle="Helpful info, guides and FAQs — in one place."
        crumbs={[{ label: "Home", href: "/" }, { label: "More" }]}
        ctaLabel="Get a quote"
        ctaHref="/get-quote"
      >
        {/* Top colour panel (subtle, premium) */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-400/12 via-blue-300/10 to-indigo-300/10" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                  Browse by product
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  Jump into the right journey
                </div>
                <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                  Use the links below to go straight to quotes and guidance relevant to your cover type.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[12px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fast answers
              </span>
            </div>

            <div className="relative mt-4 flex flex-wrap gap-2">
              {browseByProduct.map((x) => (
                <Link key={x.t} href={x.href} className="btn-ghost">
                  {x.t}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8">
          <SectionHeader eyebrow="Browse" title="Resources" right={<>FAQs • Guides • Blog</>} />

          <div className="mt-4 grid gap-4 lg:grid-cols-6">
            {tiles.map((t) => (
              <div key={t.title} className="lg:col-span-2">
                <TileCard {...t} />
              </div>
            ))}
          </div>

          {/* Tiny trust strip */}
          <div className="mt-6 flex flex-col gap-2 text-[12px] text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            {["Clear routes", "No clutter", "Built around real journeys"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Help + Policy access */}
        <div className="mt-10">
          <div className="rounded-[28px] bg-white/75 backdrop-blur p-4 sm:p-5 ring-1 ring-slate-200/70">
            <SectionHeader
              eyebrow="Next steps"
              title="Help & policy access"
              right={<>Support • Retrieve documents</>}
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-6">
              <CardShell className="lg:col-span-3">
                <div className="text-sm font-extrabold text-slate-900">Need help right now?</div>
                <p className="mt-2 text-sm text-slate-600">
                  If you’re stuck mid-quote, our support page covers the common fixes and next steps.
                </p>

                <div className="mt-6">
                  <Link className="btn-ghost inline-flex w-full justify-center" href="/help-support">
                    Go to Help & Support
                  </Link>

                  <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
                    {["Clear steps", "Fast resolution", "Real answers"].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <InfoRow
                    title="Email"
                    value="support@gotempcover.com"
                    helper="Mon–Sat, usually within one business day."
                    icon={<IconMail className="text-slate-900" />}
                  />
                  <InfoRow
                    title="Opening hours"
                    value="Mon–Sat, 9am–5pm"
                    helper="Closed Sundays & bank holidays."
                    icon={<IconClock className="text-slate-900" />}
                  />
                </div>
              </CardShell>

              <CardShell className="lg:col-span-3">
                <div className="text-sm font-extrabold text-slate-900">Already have a policy?</div>
                <p className="mt-2 text-sm text-slate-600">
                  Retrieve your policy documents instantly using your policy number.
                </p>

                <div className="mt-6">
                  <Link className="btn-primary inline-flex w-full justify-center" href="/retrieve-policy">
                    Retrieve policy
                  </Link>

                  <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
                    {["Instant access", "Secure retrieval", "No account needed"].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4">
                  <div className="text-[12px] font-extrabold text-slate-900">Quick links</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickLinks.map((x) => (
                      <Link key={x.t} href={x.href} className="btn-ghost">
                        {x.t}
                      </Link>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        </div>

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
      </PageShell>
    </div>
  );
}

/* =========================================================
   Icons (no libs) — accept className if you want, but not required
========================================================= */

function IconDoc({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path d="M14 3v5h5" stroke="#fff" strokeWidth="2" />
      <path d="M8 13h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconMap({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18 3.8 20.2A1 1 0 0 1 2.5 19.3V6.2a1 1 0 0 1 .7-1l5.8-2.1A2 2 0 0 1 10 3v15a2 2 0 0 1-1 0Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M15 6 9 3v15l6 3V6Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21.5 4.7V17.8a1 1 0 0 1-.7 1L15 21V6l5.2-2.2a1 1 0 0 1 1.3.9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconSpark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.7 3L22 17l-2.3 1-.7 3-.7-3L16 17l2.3-1 .7-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
