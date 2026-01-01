// lib/policy/types.ts
export type PolicyFinalizeInput = {
  // quote (from your get-quote page / checkout payload)
  vrm: string;
  make?: string | null;
  model?: string | null;
  year?: string | null;
  startAt: string; // ISO
  endAt: string; // ISO
  durationMs: number;
  totalAmountPence: number;

  // customer
  fullName: string;
  dob: string; // ISO date (YYYY-MM-DD or full ISO)
  email: string;
  licenceType: "UK" | "International" | "Learner" | string;
  address: string;

  // payment (provider-agnostic)
  paymentProvider: "stripe" | "btcpay" | "manual" | "test" | string;
  paymentId: string;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED" | string;

  currency?: string; // default GBP
};

export type PolicyFinalizeResult = {
  ok: true;
  policyId: string;
  policyNumber: string;
};
