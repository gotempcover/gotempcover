import type {
  PaymentProvider,
  PaymentStatus,
} from "@prisma/client";

export type PolicyFinalizeInput = {
  // quote
  vrm: string;
  make?: string | null;
  model?: string | null;
  year?: string | null;
  startAt: string;
  endAt: string;
  durationMs: number;
  totalAmountPence: number;

  // customer
  fullName: string;
  dob: string;
  email: string;
  licenceType: "UK" | "International" | "Learner";
  address: string;

  // payment (STRICT, matches Prisma)
  paymentProvider: PaymentProvider;   // ← enum
  paymentId: string;                  // Stripe session id
  paymentStatus: PaymentStatus;       // ← enum
  stripePaymentIntentId?: string | null;

  currency?: string; // default GBP
};

export type PolicyFinalizeResult = {
  ok: true;
  policyId: string;
  policyNumber: string;
};
