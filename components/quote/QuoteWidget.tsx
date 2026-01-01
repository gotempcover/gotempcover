"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================================================
   Quote Widget — Agency-grade UX
   - Progressive disclosure (Vehicle → Cover)
   - Clean duration selector + optional custom drawer
   - Ghost/light actions everywhere (per your rule)
========================================================= */

type DurationUnit = "hours" | "days" | "weeks" | "months";
type DurationPreset =
  | ""
  | "1h"
  | "3h"
  | "6h"
  | "12h"
  | "1d"
  | "2d"
  | "3d"
  | "7d"
  | "14d"
  | "1w"
  | "2w"
  | "4w"
  | "1m"
  | "2m"
  | "3m";

const PRESETS: Array<{ key: DurationPreset; label: string; group: "Hours" | "Days" | "Weeks" | "Months" }> = [
  { key: "1h", label: "1h", group: "Hours" },
  { key: "3h", label: "3h", group: "Hours" },
  { key: "6h", label: "6h", group: "Hours" },
  { key: "12h", label: "12h", group: "Hours" },

  { key: "1d", label: "1 day", group: "Days" },
  { key: "2d", label: "2 days", group: "Days" },
  { key: "3d", label: "3 days", group: "Days" },
  { key: "7d", label: "7 days", group: "Days" },
  { key: "14d", label: "14 days", group: "Days" },

  { key: "1w", label: "1 week", group: "Weeks" },
  { key: "2w", label: "2 weeks", group: "Weeks" },
  { key: "4w", label: "4 weeks", group: "Weeks" },

  { key: "1m", label: "1 month", group: "Months" },
  { key: "2m", label: "2 months", group: "Months" },
  { key: "3m", label: "3 months", group: "Months" },
];

export default function QuoteWidget({
  compact,
  showDatesInCompact = true,
}: {
  compact?: boolean;
  showDatesInCompact?: boolean;
}) {
  const [vrm, setVrm] = useState("");
  const [loading, setLoading] = useState(false);

  const [vehicle, setVehicle] = useState<any>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [manualMode, setManualMode] = useState(false);
  const [manualMake, setManualMake] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualYear, setManualYear] = useState("");

  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [durationPreset, setDurationPreset] = useState<DurationPreset>("");
  const [customOpen, setCustomOpen] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState<string>("");
  const [customDurationUnit, setCustomDurationUnit] = useState<DurationUnit>("days");

  const requireDates = !compact || showDatesInCompact;

  const normaliseVrm = (value: string) =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

  // ---------- Vehicle summary ----------
  const lookupMake = vehicle?.make || "";
  const lookupModel = vehicle?.model || "";
  const lookupYear = vehicle?.year ? String(vehicle.year) : "";
  const lookupColour = vehicle?.colour || "";
  const lookupFuel = vehicle?.fuelType || "";

  const hasLookupBasics = Boolean(lookupMake || lookupModel);

  const chosenMake = manualMode ? manualMake.trim() : lookupMake || manualMake.trim();
  const chosenModel = manualMode ? manualModel.trim() : lookupModel || manualModel.trim();
  const chosenYear = manualMode ? manualYear.trim() : lookupYear || manualYear.trim();

  const manualBasicsComplete = Boolean(manualMake.trim() && manualModel.trim());
  const hasChosenVehicleBasics = manualMode ? manualBasicsComplete : hasLookupBasics || manualBasicsComplete;

  // ---------- Date helpers ----------
  function toDatetimeLocalValue(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}`;
  }

  function addDurationToStart(startIso: string, amountMs: number) {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return "";
    const end = new Date(start.getTime() + amountMs);
    return toDatetimeLocalValue(end);
  }

  function daysInMonth(year: number, monthIndex0: number) {
    return new Date(year, monthIndex0 + 1, 0).getDate();
  }

  function addMonthsToStart(startIso: string, monthsToAdd: number) {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return "";

    const y = start.getFullYear();
    const m = start.getMonth();
    const d = start.getDate();

    const targetMonthIndex = m + monthsToAdd;
    const targetYear = y + Math.floor(targetMonthIndex / 12);
    const targetMonth = ((targetMonthIndex % 12) + 12) % 12;

    const maxDay = daysInMonth(targetYear, targetMonth);
    const day = Math.min(d, maxDay);

    const end = new Date(start);
    end.setFullYear(targetYear);
    end.setMonth(targetMonth);
    end.setDate(day);

    return toDatetimeLocalValue(end);
  }

  function presetToMs(p: Exclude<DurationPreset, "" | "1m" | "2m" | "3m">) {
    const H = 60 * 60 * 1000;
    const D = 24 * H;
    const map: Record<Exclude<DurationPreset, "" | "1m" | "2m" | "3m">, number> = {
      "1h": 1 * H,
      "3h": 3 * H,
      "6h": 6 * H,
      "12h": 12 * H,
      "1d": 1 * D,
      "2d": 2 * D,
      "3d": 3 * D,
      "7d": 7 * D,
      "14d": 14 * D,
      "1w": 7 * D,
      "2w": 14 * D,
      "4w": 28 * D,
    };
    return map[p];
  }

  function applyPreset(startIso: string, preset: DurationPreset) {
    if (!startIso || !preset) return "";
    if (preset === "1m") return addMonthsToStart(startIso, 1);
    if (preset === "2m") return addMonthsToStart(startIso, 2);
    if (preset === "3m") return addMonthsToStart(startIso, 3);
    return addDurationToStart(startIso, presetToMs(preset as any));
  }

  function applyCustomDuration(startIso: string, valueStr: string, unit: DurationUnit) {
    if (!startIso) return "";
    const n = Number(valueStr);
    if (!Number.isFinite(n) || n <= 0) return "";

    if (unit === "months") return addMonthsToStart(startIso, n);

    const H = 60 * 60 * 1000;
    const D = 24 * H;
    const ms = unit === "hours" ? n * H : unit === "days" ? n * D : n * 7 * D;
    return addDurationToStart(startIso, ms);
  }

  // When preset changes, keep end synced (if start exists)
  useEffect(() => {
    if (!requireDates) return;
    if (!startAt) return;

    if (durationPreset) {
      const computed = applyPreset(startAt, durationPreset);
      if (computed) setEndAt(computed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationPreset, startAt, requireDates]);

  // ---------- Validations ----------
  const datesValid = useMemo(() => {
    if (!requireDates) return true;
    if (!startAt || !endAt) return false;
    const s = new Date(startAt).getTime();
    const e = new Date(endAt).getTime();
    return Number.isFinite(s) && Number.isFinite(e) && e > s;
  }, [startAt, endAt, requireDates]);

  const canLookupNow = useMemo(() => {
    const clean = normaliseVrm(vrm);
    return clean.length >= 5 && !loading;
  }, [vrm, loading]);

  const canContinue = useMemo(() => {
    const clean = normaliseVrm(vrm).length >= 5;
    const hasDates = !requireDates ? true : Boolean(startAt && endAt);
    return Boolean(clean && hasChosenVehicleBasics && hasDates && datesValid);
  }, [vrm, requireDates, startAt, endAt, datesValid, hasChosenVehicleBasics]);

  const vehicleTitle = useMemo(() => {
    const mm = [lookupMake || manualMake, lookupModel || manualModel].filter(Boolean).join(" ");
    return mm || "Vehicle details";
  }, [lookupMake, lookupModel, manualMake, manualModel]);

  // ---------- Actions ----------
  async function lookupVehicle(vrmOverride?: string) {
    const vrmToUse = normaliseVrm(vrmOverride ?? vrm);
    if (vrmToUse.length < 5 || loading) return;

    setLoading(true);
    setLookupError(null);
    setFormError(null);

    try {
      const res = await fetch("/api/vehicle/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vrm: vrmToUse }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Vehicle lookup failed. Please try again.");

      const summary = data?.summary ?? null;
      setVehicle(summary);

      // Prefill manual fields
      const make = summary?.make ?? "";
      const model = summary?.model ?? "";
      const year = summary?.year ? String(summary.year) : "";

      if (make && !manualMake) setManualMake(make);
      if (model && !manualModel) setManualModel(model);
      if (year && !manualYear) setManualYear(year);

      if (!make || !model) setManualMode(true);
    } catch (e: any) {
      setLookupError(e?.message || "Vehicle lookup failed. Please try again.");
      setManualMode(true);
    } finally {
      setLoading(false);
    }
  }

  function buildQuoteDraft() {
    return {
      vrm: normaliseVrm(vrm),
      make: chosenMake || "",
      model: chosenModel || "",
      year: chosenYear || "",
      startAt: startAt || "",
      endAt: endAt || "",
      savedAt: new Date().toISOString(),
    };
  }

  function goToQuote() {
    setFormError(null);

    if (!canContinue) {
      setFormError("Please enter your reg, confirm vehicle details, and choose valid cover dates.");
      return;
    }

    const draft = buildQuoteDraft();
    try {
      sessionStorage.setItem("gtc_quote_draft", JSON.stringify(draft));
    } catch {}

    window.location.assign("/get-quote");
  }

  function toggleManualMode() {
    setManualMode((v) => !v);
    setFormError(null);
  }

  // ---------- UI: grouped presets ----------
  const presetGroups = useMemo(() => {
    const groups: Record<string, Array<{ key: DurationPreset; label: string }>> = {};
    for (const p of PRESETS) {
      groups[p.group] ??= [];
      groups[p.group].push({ key: p.key, label: p.label });
    }
    return groups;
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
            {compact ? "Quick quote" : "Get a price in minutes"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {compact
              ? "Enter your reg, choose dates, then continue."
              : "Enter your reg, confirm the vehicle, then choose exact cover times."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {/* Step 1: Vehicle */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Step 1
              </div>
              <div className="mt-1 text-sm font-extrabold text-slate-900">Vehicle</div>
              <div className="mt-1 text-sm text-slate-600">
                We’ll try to fetch the basics from your registration.
              </div>
            </div>
            <span className="badge">Reg lookup</span>
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="vrm">
              Vehicle registration
            </label>

            <div className="flex w-full flex-nowrap items-stretch gap-2">
              <input
                id="vrm"
                className="input flex-1 min-w-0"
                placeholder="e.g. AB12 CDE"
                value={vrm}
                onChange={(e) => {
                  const next = normaliseVrm(e.target.value);
                  setVrm(next);
                  setFormError(null);
                  setLookupError(null);
                  setVehicle(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (canLookupNow) lookupVehicle(normaliseVrm(vrm));
                  }
                }}
                autoCapitalize="characters"
                autoCorrect="off"
                inputMode="text"
                spellCheck={false}
                aria-invalid={!!lookupError}
                aria-describedby={lookupError ? "vrm-error" : undefined}
              />

              {/* Ghost/light Lookup button (never dark) */}
              <button
                type="button"
                onClick={() => lookupVehicle(normaliseVrm(vrm))}
                disabled={!canLookupNow}
                className={[
                  "shrink-0 w-[120px] h-[46px] rounded-xl px-4 text-xs font-extrabold transition",
                  canLookupNow
                    ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:bg-slate-50"
                    : "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed",
                ].join(" ")}
                aria-label="Lookup vehicle details"
              >
                {loading ? "Looking…" : "Lookup"}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                Press Enter or tap Lookup
              </span>

              <button
                type="button"
                onClick={toggleManualMode}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                {manualMode ? "Hide manual fields" : "Enter manually"}
              </button>
            </div>

            {lookupError ? (
              <div
                id="vrm-error"
                className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <div className="font-extrabold">We couldn’t fetch vehicle details</div>
                <div className="mt-1">{lookupError}</div>
                <div className="mt-2 text-[12px] text-red-700/80">
                  No stress — enter your vehicle details manually below.
                </div>
              </div>
            ) : null}

            {/* Vehicle summary */}
            {vehicle ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                      Vehicle found
                    </div>
                    <div className="mt-1 text-sm font-extrabold text-slate-900">
                      {vehicleTitle}
                    </div>
                    <div className="mt-1 text-[13px] text-slate-600">
                      {lookupColour ? lookupColour : null}
                      {lookupFuel ? ` • ${lookupFuel}` : null}
                      {lookupYear ? ` • ${lookupYear}` : null}
                    </div>
                  </div>

                  <span className="badge">{hasLookupBasics ? "Verified" : "Partial"}</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Manual details */}
          {manualMode ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Manual vehicle details</div>
                  <p className="mt-1 text-sm text-slate-600">
                    Only the basics are needed to continue.
                  </p>
                </div>
                <span className="badge">Manual</span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label" htmlFor="make">Make</label>
                  <input
                    id="make"
                    className="input"
                    placeholder="e.g. Toyota"
                    value={manualMake}
                    onChange={(e) => {
                      setManualMake(e.target.value);
                      setFormError(null);
                    }}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="model">Model</label>
                  <input
                    id="model"
                    className="input"
                    placeholder="e.g. Yaris"
                    value={manualModel}
                    onChange={(e) => {
                      setManualModel(e.target.value);
                      setFormError(null);
                    }}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="year">Year (optional)</label>
                  <input
                    id="year"
                    className="input"
                    placeholder="e.g. 2018"
                    inputMode="numeric"
                    value={manualYear}
                    onChange={(e) => {
                      setManualYear(e.target.value.replace(/[^0-9]/g, "").slice(0, 4));
                      setFormError(null);
                    }}
                  />
                </div>
              </div>

              {!manualBasicsComplete ? (
                <div className="mt-3 text-[12px] text-slate-500">
                  Tip: Make + Model is enough to continue.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Step 2: Cover */}
        {requireDates ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step 2
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">Cover</div>
                <div className="mt-1 text-sm text-slate-600">
                  Choose exact start and end time — or select a duration.
                </div>
              </div>
              <span className="badge">Exact times</span>
            </div>

            {/* Date inputs first (primary path) */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Start date & time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={startAt}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartAt(v);
                    setFormError(null);

                    // keep end in sync when preset/custom is active
                    if (durationPreset) {
                      const computed = applyPreset(v, durationPreset);
                      if (computed) setEndAt(computed);
                    } else if (customDurationValue) {
                      const computed = applyCustomDuration(v, customDurationValue, customDurationUnit);
                      if (computed) setEndAt(computed);
                    }
                  }}
                />
              </div>

              <div>
                <label className="label">End date & time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={endAt}
                  onChange={(e) => {
                    setEndAt(e.target.value);
                    setFormError(null);
                    if (durationPreset) setDurationPreset("");
                  }}
                />
              </div>

              {!datesValid && startAt && endAt ? (
                <div className="sm:col-span-2 text-sm text-red-600">
                  End date/time must be after start date/time.
                </div>
              ) : null}
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0);
                  const v = toDatetimeLocalValue(now);
                  setStartAt(v);
                  setFormError(null);

                  if (durationPreset) {
                    const computed = applyPreset(v, durationPreset);
                    if (computed) setEndAt(computed);
                  } else if (customDurationValue) {
                    const computed = applyCustomDuration(v, customDurationValue, customDurationUnit);
                    if (computed) setEndAt(computed);
                  }
                }}
                className="btn-ghost btn-sm"
              >
                Start now
              </button>

              <button
                type="button"
                onClick={() => {
                  setStartAt("");
                  setEndAt("");
                  setDurationPreset("");
                  setCustomDurationValue("");
                  setCustomOpen(false);
                  setFormError(null);
                }}
                className="btn-ghost btn-sm"
              >
                Clear
              </button>
            </div>

            {/* Duration selector */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                    Duration (optional)
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Pick a preset to auto-fill the end time.
                  </div>
                </div>
                <span className="badge">Auto-fill</span>
              </div>

              {/* Grouped segmented buttons */}
              <div className="mt-4 grid gap-4">
                {(["Hours", "Days", "Weeks", "Months"] as const).map((g) => (
                  <div key={g}>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {g}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(presetGroups[g] ?? []).map((p) => {
                        const active = durationPreset === p.key;
                        return (
                          <button
                            key={p.key}
                            type="button"
onClick={() => {
  const nextPreset = durationPreset === p.key ? "" : p.key;

  setDurationPreset(nextPreset);
  setCustomDurationValue("");
  setCustomOpen(false);
  setFormError(null);

  if (startAt) {
    const computed = applyPreset(startAt, nextPreset as any);
    if (computed) setEndAt(computed);
  }
}}

                            className={[
                              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
active
  ? "border-sky-300 bg-sky-50 text-slate-900 ring-2 ring-sky-200/60"
  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom duration drawer */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setCustomOpen((v) => !v)}
                  className="btn-ghost btn-sm"
                >
                  {customOpen ? "Hide custom duration" : "Custom duration"}
                </button>

                {customOpen ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-[120px_160px_1fr] items-end">
                    <div>
                      <label className="label">Value</label>
                      <input
                        className="input h-[44px]"
                        inputMode="numeric"
                        placeholder="e.g. 10"
                        value={customDurationValue}
                        onChange={(e) => {
                          setCustomDurationValue(e.target.value.replace(/[^0-9]/g, "").slice(0, 3));
                          setDurationPreset("");
                          setFormError(null);
                        }}
                      />
                    </div>

                    <div>
                      <label className="label">Unit</label>
                      <select
                        className="input h-[44px]"
                        value={customDurationUnit}
                        onChange={(e) => {
                          setCustomDurationUnit(e.target.value as any);
                          setDurationPreset("");
                          setFormError(null);
                        }}
                      >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const computed = applyCustomDuration(startAt, customDurationValue, customDurationUnit);
                          if (computed) setEndAt(computed);
                        }}
                        disabled={!startAt || !applyCustomDuration(startAt, customDurationValue, customDurationUnit)}
                        className={[
                          "btn-ghost btn-sm",
                          !startAt || !applyCustomDuration(startAt, customDurationValue, customDurationUnit)
                            ? "opacity-60 cursor-not-allowed"
                            : "",
                        ].join(" ")}
                      >
                        Apply
                      </button>
                      <div className="text-[12px] text-slate-500">
                        Set a start time first.
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Summary */}
            {startAt && endAt && datesValid ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cover period
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {startAt.replace("T", " ")} → {endAt.replace("T", " ")}
                </div>
                <div className="mt-1 text-[12px] text-slate-500">
                  You’ll confirm details on the next step before payment.
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Errors */}
        {formError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-extrabold">Action needed</div>
            <div className="mt-1">{formError}</div>
          </div>
        ) : null}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={goToQuote}
          className={`btn-primary w-full ${!canContinue ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!canContinue}
        >
          Continue
        </button>

        {/* Trust strip */}
        {!compact ? (
          <div className="grid gap-2 text-[12px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Secure checkout next
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Instant documents after purchase
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Policy retrieval anytime
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
