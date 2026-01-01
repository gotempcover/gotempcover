// app/more/guides/page.tsx
import Link from "next/link";
import PageShell from "@/components/site/PageShell";

type Guide = {
  title: string;
  desc: string;
  href: string;
  badge: string;
  bullets: string[];
};

const guides: Guide[] = [
  {
    title: "Temporary car insurance guide",
    badge: "Start here",
    desc: "How short-term cover works, what you’ll need, and how to choose the right duration.",
    href: "/car",
    bullets: ["Choose exact times", "Instant documents", "Clear pricing"],
  },
  {
    title: "Learner insurance guide",
    badge: "Learners",
    desc: "Short-term cover for practice sessions — what supervision means, and how documents work.",
    href: "/learner",
    bullets: ["Practice sessions", "Document access", "Simple steps"],
  },
  {
    title: "Temporary van insurance guide",
    badge: "Vans",
    desc: "Ideal for moves, jobs, or borrowing a van — what to check before you start cover.",
    href: "/van",
    bullets: ["Moves & jobs", "Short durations", "No long contracts"],
  },
  {
    title: "Impound insurance guide",
    badge: "Impound",
    desc: "What impound cover is used for, what you may need, and where to find your documents.",
    href: "/impound",
    bullets: ["Release requirements", "Document retrieval", "Clear guidance"],
  },
];

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 ring-1 ring-slate-200">
      {children}
    </span>
  );
}

function GuideCard({ g }: { g: Guide }) {
  return (
    <Link
      href={g.href}
      className={[
        "group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition",
        "hover:-translate-y-[1px] hover:ring-slate-300 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">
            {g.title}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {g.desc}
          </p>
        </div>
        <SoftChip>{g.badge}</SoftChip>
      </div>

      <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
        {g.bullets.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900">
          Explore →
        </span>
        <span className="text-[12px] text-slate-500 opacity-0 transition group-hover:opacity-100">
          Open guide
        </span>
      </div>
    </Link>
  );
}

function ActionCard({
  title,
  desc,
  href,
  cta,
  variant = "ghost",
  bullets,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  variant?: "ghost" | "primary";
  bullets: string[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="text-sm font-extrabold text-slate-900">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>

      <Link
        href={href}
        className={[
          variant === "primary" ? "btn-primary" : "btn-ghost",
          "mt-4 inline-flex w-full",
        ].join(" ")}
      >
        {cta}
      </Link>

      <div className="mt-4 grid gap-2 text-[12px] text-slate-500">
        {bullets.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title="Guides"
      subtitle="Clear, step-by-step help for temporary cover — designed to be quick to scan."
      crumbs={[
        { label: "Home", href: "/" },
        { label: "More", href: "/more" },
        { label: "Guides" },
      ]}
      ctaLabel="Get a quote"
      ctaHref="/get-quote"
    >
      {/* Hero wash (premium section divider feel) */}
      <div className="mt-4 rounded-[28px] bg-slate-900/[0.03] p-5 sm:p-6 ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              Practical guides • Simple steps • Clear documents
            </div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Guides that get you to cover faster
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Whether you’re borrowing a car, practising as a learner, driving a van, or handling an impound
              situation — this section explains what to do next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SoftChip>Updated for clarity</SoftChip>
            <SoftChip>No jargon</SoftChip>
            <SoftChip>Fast to read</SoftChip>
          </div>
        </div>
      </div>

      {/* Guides grid */}
      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              Featured
            </div>
            <div className="mt-1 text-sm font-extrabold text-slate-900">
              Most used guides
            </div>
          </div>
          <SoftChip>{guides.length} guides</SoftChip>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {guides.map((g) => (
            <GuideCard key={g.title} g={g} />
          ))}
        </div>
      </div>

      {/* Premium divider wash */}
      <div className="mt-10 rounded-[28px] bg-slate-900/[0.03] p-5 sm:p-6 ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              Quick routes
            </div>
            <div className="mt-1 text-sm font-extrabold text-slate-900">
              Need an answer or a document right now?
            </div>
          </div>
          <SoftChip>Fast actions</SoftChip>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ActionCard
            title="FAQs"
            desc="Clear answers on cover, eligibility, documents and timings."
            href="/more/faq"
            cta="Browse FAQs"
            variant="ghost"
            bullets={["Common questions", "Simple answers", "Quick to scan"]}
          />

          <ActionCard
            title="Retrieve policy"
            desc="Retrieve your policy documents instantly using your policy number."
            href="/retrieve-policy"
            cta="Retrieve policy"
            variant="primary"
            bullets={["Instant access", "Secure retrieval", "No account needed"]}
          />
        </div>

        <div className="mt-4">
          <ActionCard
            title="Help & Support"
            desc="If you’re stuck, our support section covers common issues and next steps."
            href="/help-support"
            cta="Go to Help & Support"
            variant="ghost"
            bullets={["Clear steps", "Fast resolution", "Real answers"]}
          />
        </div>
      </div>
    </PageShell>
  );
}
