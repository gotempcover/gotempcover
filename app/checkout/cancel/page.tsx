import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[12px] font-extrabold text-slate-700 ring-1 ring-slate-200">
          Checkout cancelled
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          No charge was made
        </h1>

        <p className="mt-2 text-slate-600">
          Your payment was cancelled. You can return to your quote and try again whenever you’re ready.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <div className="text-sm font-semibold text-slate-900">Quick options</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Go back to your quote to review dates and price</li>
            <li>• If you’ve already paid and didn’t get an email, use Retrieve policy</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white"
            href="/get-quote"
          >
            Return to quote
          </Link>

          <Link
            className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white"
            href="/retrieve-policy"
          >
            Retrieve policy
          </Link>

          <Link
            className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 bg-white"
            href="/"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-5 text-[12px] text-slate-500">
          Need help? Email{" "}
          <a className="underline" href="mailto:support@gotempcover.co.uk">
            support@gotempcover.co.uk
          </a>
        </div>
      </div>
    </main>
  );
}
