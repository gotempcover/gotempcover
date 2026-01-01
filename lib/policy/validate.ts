// lib/policy/validate.ts
import type { PolicyFinalizeInput } from "./types";

export function validateFinalizeInput(input: PolicyFinalizeInput) {
  const errors: string[] = [];

  const required = (k: keyof PolicyFinalizeInput) => {
    const v = input[k] as any;
    if (v === undefined || v === null || (typeof v === "string" && !v.trim())) {
      errors.push(`${String(k)} is required`);
    }
  };

  required("vrm");
  required("startAt");
  required("endAt");
  required("durationMs");
  required("totalAmountPence");
  required("fullName");
  required("dob");
  required("email");
  required("licenceType");
  required("address");
  required("paymentProvider");
  required("paymentId");
  required("paymentStatus");

  // numeric sanity
  if (!Number.isFinite(Number(input.durationMs))) errors.push("durationMs must be a number");
  if (!Number.isFinite(Number(input.totalAmountPence))) errors.push("totalAmountPence must be a number");

  if (!Number.isInteger(Number(input.durationMs))) errors.push("durationMs must be an integer");
  if (!Number.isInteger(Number(input.totalAmountPence))) errors.push("totalAmountPence must be an integer");

  if (Number(input.durationMs) <= 0) errors.push("durationMs must be > 0");
  if (Number(input.totalAmountPence) < 0) errors.push("totalAmountPence must be >= 0");

  const start = new Date(input.startAt);
  const end = new Date(input.endAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    errors.push("startAt/endAt must be valid ISO dates");
  } else {
    if (end.getTime() <= start.getTime()) errors.push("endAt must be after startAt");
    const ms = end.getTime() - start.getTime();
    if (Math.abs(ms - Number(input.durationMs)) > 5 * 60 * 1000) {
      errors.push("durationMs does not match startAt/endAt");
    }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email).trim());
  if (!emailOk) errors.push("email is invalid");

  const dob = new Date(input.dob);
  if (Number.isNaN(dob.getTime())) errors.push("dob is invalid");
  else if (dob.getTime() > Date.now()) errors.push("dob cannot be in the future");

  return { ok: errors.length === 0, errors };
}
