import Link from "next/link";

function BrandMark() {
  return (
    <div
      aria-hidden="true"
      className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm"
    />
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/65 backdrop-blur">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* Brand + compliance */}
          <div>
            <div className="flex items-center gap-3">
              <BrandMark />
              <div>
                <div className="text-sm font-extrabold tracking-tight text-slate-900">
                  GoTempCover
                </div>
                <div className="text-xs text-slate-500">
                  Temporary cover, without the hassle.
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Choose your start and end times, see your price, then check out securely. Your documents
              are available instantly after purchase and sent to your email.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-[12px] text-slate-600">
              {["Secure checkout", "Instant documents after purchase", "Retrieve policy anytime"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
              Important: GoTempCover is a service for arranging temporary insurance. Cover is subject
              to eligibility, underwriting and acceptance by the insurer. Always read your policy
              documents carefully.
            </p>
          </div>

          {/* Links + retrieval */}
          <div className="md:justify-self-end">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-semibold text-slate-900">Company</div>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <Link className="text-slate-600 hover:text-slate-900" href="/contact">
                    Contact
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/privacy">
                    Privacy
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/terms">
                    Terms
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-900">Products</div>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <Link className="text-slate-600 hover:text-slate-900" href="/car">
                    Car insurance
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/van">
                    Van insurance
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/learner">
                    Learner insurance
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/impound">
                    Impound insurance
                  </Link>
                  <Link className="text-slate-600 hover:text-slate-900" href="/more">
                    More
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 card p-5">
              <div className="text-sm font-extrabold text-slate-900">Already have a policy?</div>
              <p className="mt-2 text-sm text-slate-600">
                Retrieve documents using your policy number and email.
              </p>

              {/* Ghost/light (per global rule) */}
              <Link className="btn-ghost mt-4 inline-flex" href="/retrieve-policy">
                Retrieve policy
              </Link>

              <div className="mt-3 text-[12px] text-slate-500">
                Fast self-serve access. No waiting around.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} GoTempCover. All rights reserved.
          </div>
          <div className="text-xs text-slate-500">
            Built for speed, clarity & compliance.
          </div>
        </div>
      </div>
    </footer>
  );
}
