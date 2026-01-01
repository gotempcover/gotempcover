import Link from "next/link";

function BrandMark() {
  return (
    <div
      aria-hidden="true"
      className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm"
    />
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-blue-200/40"
          aria-label="GoTempCover home"
        >
          <BrandMark />
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">
              GoTempCover
            </div>
            <div className="text-[11px] text-slate-500">
              Temporary cover, without the hassle
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/car">
            Car
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/van">
            Van
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/learner">
            Learner
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/impound">
            Impound
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/more">
            More
          </Link>
          <Link className="text-sm text-slate-700 hover:text-slate-900" href="/retrieve-policy">
            Retrieve policy
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link className="btn-ghost hidden sm:inline-flex" href="/retrieve-policy">
            Retrieve policy
          </Link>
          <Link className="btn-primary" href="/get-quote">
            Get quote
          </Link>
        </div>
      </div>
    </header>
  );
}
