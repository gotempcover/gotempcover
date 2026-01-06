// components/site/Footer.tsx
import Link from "next/link";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="link text-sm" href={href}>
      {children}
    </Link>
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
              {/* Static logo (no motion, no hooks, no client boundaries) */}
              <img
                src="/brand/gotempcover.svg"
                alt="GoTempCover logo"
                className="h-9 w-9 shrink-0"
              />

              <div className="min-w-0 leading-tight">
<div className="text-[15px] font-extrabold tracking-tight text-slate-900">
  GoTempCover
</div>

                <div className="text-[11px] text-slate-500">
                  Temporary cover, simplified.
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Choose your exact start and end time, review your premium, then pay
              securely. Your Certificate of Motor Insurance and policy documents are
              issued instantly after purchase and sent to your email.
            </p>

            <div className="mt-6 grid gap-2 text-[12px] text-slate-600">
              {[
                "Secure checkout (Stripe)",
                "Instant documents after purchase",
                "Self-serve policy retrieval anytime",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
              Important: Cover is subject to eligibility, underwriting and acceptance.
              Always review your Certificate of Motor Insurance and Statement of Fact
              before driving.
            </p>

            {/* Social (optional) */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-slate-500">Never miss a beat:</span>
              <a className="link text-sm" href="#" aria-label="GoTempCover on Facebook">
                Facebook
              </a>
              <a className="link text-sm" href="#" aria-label="GoTempCover on Instagram">
                Instagram
              </a>
            </div>
          </div>

          {/* Links + retrieval */}
          <div className="md:justify-self-end md:min-w-[420px]">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-semibold text-slate-900">Support</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink href="/help-support">Help centre</FooterLink>
                  <FooterLink href="/contact">Contact</FooterLink>
                  <FooterLink href="/retrieve-policy">Retrieve policy</FooterLink>
                  <FooterLink href="/complaints">Complaints</FooterLink>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-900">Company</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink href="/privacy">Privacy</FooterLink>
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/cookies">Cookies</FooterLink>
                  <FooterLink href="/more/faq">FAQs</FooterLink>
                </div>
              </div>
            </div>

            <div className="mt-8 card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-slate-900">
                    Already purchased cover?
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Retrieve your Certificate and policy documents using your policy
                    number and email.
                  </p>
                </div>

                <span className="badge">Self-serve</span>
              </div>

              {/* Ghost/light (per your global rule) */}
              <Link className="btn-ghost mt-4 inline-flex" href="/retrieve-policy">
                Retrieve policy
              </Link>

              <div className="mt-3 text-[12px] text-slate-500">
                Immediate access to documents — no waiting for support.
              </div>
            </div>

            {/* Regulatory / legal block */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5">
              <div className="text-xs font-extrabold text-slate-900">
                Regulatory information
              </div>

              <div className="mt-3 text-[11px] leading-relaxed text-slate-600">
                We hereby certify that the policy satisfies the requirements of the relevant law
                applicable in Great Britain, Northern Ireland, the Isle of Man, and the islands of
                Alderney, Guernsey and Jersey.
              </div>

              <div className="mt-3 text-[11px] leading-relaxed text-slate-600">
                GoTempCover Limited is authorised by the Gibraltar Financial Services Commission to
                carry on insurance business under the Financial Services Act 2019 and Financial
                Services Regulations 2020, registered address 5/5 Crutchett’s Ramp, Gibraltar.
                Details about our regulation by the Financial Conduct Authority and Prudential
                Regulation Authority are available on request.
              </div>

              <div className="mt-3 text-[11px] leading-relaxed text-slate-600">
                Registered in England and Wales as{" "}
                <span className="font-semibold">ACCELERANT INSURANCE UK LIMITED</span>. Reg. No. 03326800.
                Registered Address: One, Fleet Place, London, England, EC4M 7WS. Authorised and
                regulated by the Financial Conduct Authority (207658).
              </div>

              <div className="mt-4 text-[11px] leading-relaxed text-slate-500">
                Confidentiality notice: The content of this site and any related communications is
                intended for the recipient specified only. If you believe you have received something
                in error, please notify us and delete it.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} GoTempCover. All rights reserved.
          </div>
          <div className="text-xs text-slate-500">
            Secure checkout • Instant documents • Policy retrieval
          </div>
        </div>
      </div>
    </footer>
  );
}
