"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/site/PageShell";
import Link from "next/link";

/* =========================================================
   Types
========================================================= */

type QuoteDraft = {
  vrm: string;
  make: string;
  model: string;
  year: string;
  startAt: string; // datetime-local
  endAt: string; // datetime-local
  savedAt?: string;
};

type DrivingLicenceType = "UK" | "International" | "Learner";

type AddressStructured = {
  line1: string;
  line2: string;
  town: string;
  county: string;
  postcode: string;
};

type CustomerDetails = {
  fullName: string;
  dob: string; // YYYY-MM-DD
  email: string;
  licenceType: DrivingLicenceType;
  address: string; // computed
};

type PriceOptionKey = "hour" | "day" | "week" | "month";

type PriceOption = {
  key: PriceOptionKey;
  label: string;
  helper: string;
  unitLabel: string;
  unitPrice: number;
  units: number;
  total: number;
};

const RATES = {
  hour: 1.99,
  day: 24.99,
  week: 149.99,
  month: 290.0,
} as const;

/* =========================================================
   Helpers
========================================================= */

function moneyGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function parseDateTimeLocal(dt: string) {
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? null : d;
}

function prettyDateTime(dt: string) {
  if (!dt) return "";
  return dt.replace("T", " ");
}

function clampMin(n: number, min: number) {
  return n < min ? min : n;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDatetimeLocalValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function calcAge(dobISO: string) {
  if (!dobISO) return null;
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function makeQuoteRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "GTC-";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function normalisePostcode(pc: string) {
  return pc.toUpperCase().replace(/\s+/g, " ").trim();
}

function buildAddressString(a: AddressStructured) {
  const parts = [
    a.line1.trim(),
    a.line2.trim(),
    a.town.trim(),
    a.county.trim(),
    normalisePostcode(a.postcode),
  ].filter(Boolean);
  return parts.join(", ");
}

/* =========================================================
   Small UI bits (ghost/light standard)
========================================================= */

function SoftChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-slate-700 border border-slate-200">
      {children}
    </span>
  );
}

/* =========================================================
   Page
========================================================= */

export default function GetQuotePage() {
  const [draft, setDraft] = useState<QuoteDraft | null>(null);
  const [quoteRef, setQuoteRef] = useState<string>("");

  const [address, setAddress] = useState<AddressStructured>({
    line1: "",
    line2: "",
    town: "",
    county: "",
    postcode: "",
  });

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: "",
    dob: "",
    email: "",
    licenceType: "UK",
    address: "",
  });

  const [selectedPlan, setSelectedPlan] = useState<PriceOptionKey | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingDates, setEditingDates] = useState(false);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Load draft + quote ref
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gtc_quote_draft");
      if (raw) setDraft(JSON.parse(raw) as QuoteDraft);

      const existingRef = sessionStorage.getItem("gtc_quote_ref");
      if (existingRef) setQuoteRef(existingRef);
      else {
        const ref = makeQuoteRef();
        sessionStorage.setItem("gtc_quote_ref", ref);
        setQuoteRef(ref);
      }
    } catch {
      setDraft(null);
    }
  }, []);

  // Keep computed address in sync
  useEffect(() => {
    const addr = buildAddressString(address);
    setCustomer((c) => ({ ...c, address: addr }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.line1, address.line2, address.town, address.county, address.postcode]);

  const durationMs = useMemo(() => {
    if (!draft?.startAt || !draft?.endAt) return 0;
    const s = parseDateTimeLocal(draft.startAt);
    const e = parseDateTimeLocal(draft.endAt);
    if (!s || !e) return 0;
    const ms = e.getTime() - s.getTime();
    return ms > 0 ? ms : 0;
  }, [draft?.startAt, draft?.endAt]);

  const durationLabel = useMemo(() => {
    if (!durationMs) return "";
    const mins = Math.ceil(durationMs / (60 * 1000));
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    if (hours <= 0) return `${mins} min`;
    if (rem === 0) return `${hours}h`;
    return `${hours}h ${rem}m`;
  }, [durationMs]);

  const pricing = useMemo(() => {
    if (!durationMs) return { options: [] as PriceOption[], best: null as PriceOption | null };

    const H = 60 * 60 * 1000;
    const D = 24 * H;
    const W = 7 * D;
    const M = 30 * D;

    const hours = clampMin(Math.ceil(durationMs / H), 1);
    const days = clampMin(Math.ceil(durationMs / D), 1);
    const weeks = clampMin(Math.ceil(durationMs / W), 1);
    const months = clampMin(Math.ceil(durationMs / M), 1);

    const options: PriceOption[] = [
      { key: "hour", label: "Hourly", helper: "For short journeys", unitLabel: "hour", unitPrice: RATES.hour, units: hours, total: Number((hours * RATES.hour).toFixed(2)) },
      { key: "day", label: "Daily", helper: "Most popular", unitLabel: "day", unitPrice: RATES.day, units: days, total: Number((days * RATES.day).toFixed(2)) },
      { key: "week", label: "Weekly", helper: "Better value", unitLabel: "week", unitPrice: RATES.week, units: weeks, total: Number((weeks * RATES.week).toFixed(2)) },
      { key: "month", label: "Monthly", helper: "Longer cover", unitLabel: "month", unitPrice: RATES.month, units: months, total: Number((months * RATES.month).toFixed(2)) },
    ];

    const best = options.reduce((acc, cur) => (cur.total < acc.total ? cur : acc), options[0]);
    return { options, best };
  }, [durationMs]);

  useEffect(() => {
    if (!pricing.best) return;
    setSelectedPlan((prev) => prev ?? pricing.best!.key);
  }, [pricing.best]);

  const selected = useMemo(() => {
    if (!selectedPlan) return null;
    return pricing.options.find((o) => o.key === selectedPlan) ?? null;
  }, [pricing.options, selectedPlan]);

  const vehicleLine = useMemo(() => {
    if (!draft?.vrm) return "";
    const makeModel = [draft.make, draft.model].filter(Boolean).join(" ");
    const year = draft.year ? ` • ${draft.year}` : "";
    return `${draft.vrm} • ${makeModel || "Vehicle"}${year}`;
  }, [draft]);

  const datesLine = useMemo(() => {
    if (!draft?.startAt || !draft?.endAt) return "";
    return `${prettyDateTime(draft.startAt)} → ${prettyDateTime(draft.endAt)}`;
  }, [draft]);

  const validations = useMemo(() => {
    const fullNameOk = customer.fullName.trim().length >= 2;
    const emailOk = validEmail(customer.email);

    const age = calcAge(customer.dob);
    const dobOk = Boolean(customer.dob) && age !== null && age >= 17;

    const line1Ok = address.line1.trim().length >= 4;
    const townOk = address.town.trim().length >= 2;
    const postcodeOk = normalisePostcode(address.postcode).length >= 5;
    const addressOk = line1Ok && townOk && postcodeOk;

    const licenceOk = Boolean(customer.licenceType);
    const draftOk = Boolean(draft?.vrm && draft?.startAt && draft?.endAt && durationMs > 0);
    const pricingOk = Boolean(selected);

    return {
      fullNameOk,
      dobOk,
      emailOk,
      addressOk,
      line1Ok,
      townOk,
      postcodeOk,
      licenceOk,
      draftOk,
      pricingOk,
      canContinue: fullNameOk && dobOk && emailOk && addressOk && licenceOk && draftOk && pricingOk,
    };
  }, [customer, address, draft, durationMs, selected]);

  const canContinue = validations.canContinue;

  function saveDraft(next: QuoteDraft) {
    setDraft(next);
    try {
      sessionStorage.setItem("gtc_quote_draft", JSON.stringify(next));
    } catch {}
  }

async function onContinueToPayment() {
  setFormError(null);

  if (!draft?.vrm) {
    setFormError(
      "We couldn’t find your saved vehicle details. Go back and re-enter your reg to continue."
    );
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (!draft.startAt || !draft.endAt || !durationMs) {
    setFormError("Your cover dates need adjusting — end time must be after start time.");
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (!selected) {
    setFormError("Choose a pricing option to continue.");
    return;
  }

  if (!canContinue) {
    setFormError("Please complete the details highlighted on the left before continuing.");
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const payload = {
    quoteRef: quoteRef || makeQuoteRef(),
    quote: {
      vrm: draft.vrm,
      make: draft.make,
      model: draft.model,
      year: draft.year,
      startAt: draft.startAt,
      endAt: draft.endAt,
      durationMs,
    },
    customer: { ...customer, address: buildAddressString(address) },
    pricing: {
      selectedPlan: selected.key,
      selectedLabel: selected.label,
      units: selected.units,
      unitPrice: selected.unitPrice,
      total: selected.total,
      rateCard: RATES,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem("gtc_checkout_payload", JSON.stringify(payload));
  } catch {}

  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quote: {
          vrm: draft.vrm,
          make: draft.make || "",
          model: draft.model || "",
          year: draft.year || "",
          // checkout expects ISO timestamps
          startAt: new Date(draft.startAt).toISOString(),
          endAt: new Date(draft.endAt).toISOString(),
          durationMs,
          totalAmountPence: Math.round((selected.total ?? 0) * 100),
        },
        customer: {
          fullName: customer.fullName,
          dob: customer.dob,
          email: customer.email,
          licenceType: customer.licenceType,
          address: buildAddressString(address),
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.url) {
      throw new Error(data?.error || "Failed to start checkout");
    }

    window.location.href = data.url as string;
  } catch (err: any) {
    setFormError(err?.message || "Something went wrong starting checkout.");
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}


  const subtitle = draft?.vrm
    ? "Review your details, adjust dates if needed, then choose the best-value option."
    : "We can’t find your saved details — go back and enter your reg + cover dates.";

  return (
    <PageShell
      eyebrow="Get a quote"
      title="Your quote — review & continue"
      subtitle={subtitle}
      crumbs={[{ label: "Home", href: "/" }, { label: "Get quote" }]}
      ctaLabel="Back"
      ctaHref="/"
    >
      {/* Top header */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              Quote reference
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="text-base font-extrabold tracking-tight text-slate-900">
                {quoteRef || "—"}
              </div>
              {draft?.vrm ? <SoftChip>Saved on this device</SoftChip> : <SoftChip>Missing</SoftChip>}
              {durationLabel ? <SoftChip>Duration {durationLabel}</SoftChip> : null}
            </div>
            <div className="mt-1 text-[12px] text-slate-500">
              We’ll use this reference on your confirmation and documents.
            </div>
          </div>

          {/* Step pill (ghost/light) */}
          <span className="inline-flex items-center rounded-full bg-white text-slate-700 border border-slate-200 px-3 py-1.5 text-[12px] font-extrabold">
            Step 1 of 2 • Details
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* LEFT */}
        <div className="grid gap-6" ref={detailsRef}>
          {/* Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Summary
                </div>

                <div className="mt-3 rounded-2xl bg-slate-50 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-lg font-extrabold tracking-tight text-slate-900">
                      {draft?.vrm || "—"}
                    </div>
                    {draft?.make || draft?.model ? (
                      <SoftChip>{`${draft?.make || ""} ${draft?.model || ""}`.trim()}</SoftChip>
                    ) : (
                      <SoftChip>Vehicle</SoftChip>
                    )}
                    {draft?.year ? <SoftChip>{draft.year}</SoftChip> : null}
                  </div>

                  <div className="mt-3 text-[13px] text-slate-700">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Cover period
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {draft?.startAt && draft?.endAt ? datesLine : "—"}
                    </div>
                    {durationLabel ? (
                      <div className="mt-1 text-[13px] text-slate-600">
                        Duration: <span className="font-extrabold text-slate-900">{durationLabel}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <span className="badge">{draft?.vrm ? "Loaded" : "Missing"}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/" className="btn-ghost">
                Change vehicle
              </Link>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingDates((v) => !v);
                  setFormError(null);
                }}
              >
                {editingDates ? "Hide date editor" : "Edit cover dates"}
              </button>
            </div>

            {editingDates && draft ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Adjust cover dates</div>
                    <div className="mt-1 text-sm text-slate-600">We’ll update pricing automatically.</div>
                  </div>
                  <SoftChip>Updates instantly</SoftChip>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Start</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={draft.startAt}
                      onChange={(e) => saveDraft({ ...draft, startAt: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">End</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={draft.endAt}
                      onChange={(e) => saveDraft({ ...draft, endAt: e.target.value })}
                    />
                  </div>

                  {durationMs <= 0 ? (
                    <div className="sm:col-span-2 text-sm text-red-600">
                      End date/time must be after start date/time.
                    </div>
                  ) : null}

                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        const now = new Date();
                        now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0);
                        saveDraft({ ...draft, startAt: toDatetimeLocalValue(now) });
                      }}
                    >
                      Start now
                    </button>

                    <button type="button" className="btn-ghost" onClick={() => setEditingDates(false)}>
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Customer form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-extrabold tracking-tight text-slate-900">Your details</div>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll use these for your documents and confirmation email.
                </p>
              </div>
              <span className="badge">Secure</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  className="input"
                  placeholder="e.g. John Smith"
                  value={customer.fullName}
                  onChange={(e) => {
                    setCustomer((c) => ({ ...c, fullName: e.target.value }));
                    setFormError(null);
                  }}
                />
                {!validations.fullNameOk && customer.fullName ? (
                  <div className="field-error">Enter your full name as it appears on your licence.</div>
                ) : (
                  <div className="field-hint">Make sure this matches your licence for documents.</div>
                )}
              </div>

              <div>
                <label className="label" htmlFor="dob">Date of birth</label>
                <input
                  id="dob"
                  type="date"
                  className="input"
                  value={customer.dob}
                  onChange={(e) => {
                    setCustomer((c) => ({ ...c, dob: e.target.value }));
                    setFormError(null);
                  }}
                />
                {customer.dob && !validations.dobOk ? (
                  <div className="field-error">You must be 17+ to continue.</div>
                ) : (
                  <div className="field-hint">We use this to confirm driver eligibility.</div>
                )}
              </div>

              <div>
                <label className="label" htmlFor="licenceType">Driving licence type</label>
                <select
                  id="licenceType"
                  className="input"
                  value={customer.licenceType}
                  onChange={(e) => {
                    setCustomer((c) => ({ ...c, licenceType: e.target.value as DrivingLicenceType }));
                    setFormError(null);
                  }}
                >
                  <option value="UK">UK</option>
                  <option value="International">International</option>
                  <option value="Learner">Learner</option>
                </select>
                <div className="field-hint">This helps route you to the correct cover journey.</div>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  placeholder="e.g. name@email.com"
                  inputMode="email"
                  value={customer.email}
                  onChange={(e) => {
                    setCustomer((c) => ({ ...c, email: e.target.value }));
                    setFormError(null);
                  }}
                />
                {customer.email && !validations.emailOk ? (
                  <div className="field-error">Enter a valid email address.</div>
                ) : (
                  <div className="field-hint">We’ll send your documents and confirmation here.</div>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <div className="flex items-end justify-between gap-3">
                  <label className="label">Address</label>
                  <span className="text-[12px] text-slate-500">For documents</span>
                </div>

                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <input
                      className="input"
                      placeholder="Address line 1 (house number + street)"
                      value={address.line1}
                      onChange={(e) => { setAddress((a) => ({ ...a, line1: e.target.value })); setFormError(null); }}
                    />
                    {address.line1 && !validations.line1Ok ? (
                      <div className="field-error">Add your house number + street.</div>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      className="input"
                      placeholder="Address line 2 (optional)"
                      value={address.line2}
                      onChange={(e) => { setAddress((a) => ({ ...a, line2: e.target.value })); setFormError(null); }}
                    />
                  </div>

                  <div>
                    <input
                      className="input"
                      placeholder="Town / City"
                      value={address.town}
                      onChange={(e) => { setAddress((a) => ({ ...a, town: e.target.value })); setFormError(null); }}
                    />
                    {address.town && !validations.townOk ? (
                      <div className="field-error">Enter your town/city.</div>
                    ) : null}
                  </div>

                  <div>
                    <input
                      className="input"
                      placeholder="County (optional)"
                      value={address.county}
                      onChange={(e) => { setAddress((a) => ({ ...a, county: e.target.value })); setFormError(null); }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      className="input"
                      placeholder="Postcode"
                      value={address.postcode}
                      onChange={(e) => { setAddress((a) => ({ ...a, postcode: normalisePostcode(e.target.value) })); setFormError(null); }}
                    />
                    {address.postcode && !validations.postcodeOk ? (
                      <div className="field-error">Enter a valid UK postcode.</div>
                    ) : (
                      <div className="field-hint">We’ll format this automatically.</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Document address
                  </div>
                  <div className="mt-1 text-[13px] text-slate-700">{customer.address || "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold tracking-tight text-slate-900">Your price</h3>
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-700 border border-slate-200">
                    Checkout next
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  Pick the option that suits your cover period.
                </p>

                {draft?.vrm ? (
                  <p className="mt-2 truncate text-[12px] text-slate-500">{vehicleLine}</p>
                ) : null}
              </div>
            </div>

            <div className="px-6 pb-6">
              {!durationMs ? (
                <div className="mt-6 text-sm text-slate-600">
                  Add valid start/end dates to see pricing.
                </div>
              ) : (
                <>
                  <div className="mt-4 text-[12px] text-slate-500">
                    Based on your selected dates. VAT included.
                  </div>

                  {/* Options */}
                  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-50/60 ring-1 ring-slate-200/60">
                    {pricing.options.map((opt, idx) => {
                      const isSelected = selectedPlan === opt.key;
                      const isBest = pricing.best?.key === opt.key;

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(opt.key);
                            setFormError(null);
                          }}
                          className={[
                            "relative w-full text-left px-5 py-4",
                            "transition-[background-color,box-shadow,transform] duration-200",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
                            idx !== 0 ? "border-t border-slate-200/70" : "",
                            isSelected
                              ? "bg-white ring-1 ring-inset ring-blue-200 shadow-[0_1px_0_0_rgba(15,23,42,0.02)]"
                              : "bg-transparent hover:bg-white/60 hover:translate-y-[-1px]",
                          ].join(" ")}
                          aria-pressed={isSelected}
                        >
                          {isSelected ? (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-600/90" aria-hidden="true" />
                          ) : null}

                          <div className="flex items-start gap-4">
                            <span
                              className={[
                                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
                                isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              <span className={["h-2 w-2 rounded-full", isSelected ? "bg-white" : "bg-transparent"].join(" ")} />
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-sm font-extrabold text-slate-900">{opt.label}</div>

                                {isBest ? (
                                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-extrabold text-blue-800 border border-blue-100">
                                    Best value
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold text-slate-700 border border-slate-200">
                                    {opt.helper}
                                  </span>
                                )}

                                {isSelected ? (
                                  <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold text-slate-700 border border-slate-200">
                                    Selected
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-1 text-[13px] text-slate-600">
                                <span className="font-semibold text-slate-900">{opt.units}</span>{" "}
                                {opt.unitLabel}
                                {opt.units === 1 ? "" : "s"} •{" "}
                                <span className="font-semibold text-slate-900">{moneyGBP(opt.unitPrice)}</span> /{" "}
                                {opt.unitLabel}
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <div className="text-xl font-extrabold tracking-tight text-slate-900">
                                {moneyGBP(opt.total)}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-400">VAT included</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected total */}
                  <div className="mt-6 flex items-end justify-between gap-6 border-t border-slate-200 pt-6">
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                        Total today
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        {selected ? (
                          <>
                            {selected.units} {selected.unitLabel}
                            {selected.units === 1 ? "" : "s"} • {selected.label.toLowerCase()}
                          </>
                        ) : (
                          "Choose an option"
                        )}
                      </div>
                      <div className="mt-1 text-[12px] text-slate-500">
                        You’ll review everything before paying.
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {selected ? moneyGBP(selected.total) : "—"}
                      </div>
                      <div className="text-[12px] text-slate-500">VAT included</div>
                    </div>
                  </div>
                </>
              )}

              {formError ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <div className="font-extrabold">Action needed</div>
                  <div className="mt-1">{formError}</div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={onContinueToPayment}
                disabled={!canContinue}
                className={`btn-primary mt-6 w-full ${!canContinue ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                Continue to checkout
              </button>

              <div className="mt-3 text-[12px] text-slate-500">
                Next step: secure payment, then instant documents by email.
              </div>

              {/* Trust strip (light + consistent) */}
              <div className="mt-5 flex flex-col gap-2 text-[12px] text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                {["Secure checkout", "Instant documents after purchase", "Retrieve policy anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="container-app py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500">Total</div>
            <div className="truncate text-sm font-extrabold text-slate-900">
              {selected ? moneyGBP(selected.total) : "Choose a price option"}
            </div>
          </div>
          <button
            type="button"
            onClick={onContinueToPayment}
            disabled={!canContinue}
            className={`btn-primary ${!canContinue ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            Continue
          </button>
        </div>
      </div>
    </PageShell>
  );
}
