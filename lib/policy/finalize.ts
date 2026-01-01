// lib/policy/finalize.ts
import { prisma } from "@/db/prisma";
import type { PolicyFinalizeInput, PolicyFinalizeResult } from "./types";
import { validateFinalizeInput } from "./validate";
import { generatePolicyNumber } from "./policyNumber";

export async function finalizePolicy(input: PolicyFinalizeInput): Promise<PolicyFinalizeResult> {
  const v = validateFinalizeInput(input);
  if (!v.ok) {
    throw new Error(v.errors.join(" • "));
  }

  // Idempotency: same provider+paymentId returns existing policy
  const existing = await prisma.policy.findFirst({
    where: {
      paymentProvider: input.paymentProvider,
      paymentId: input.paymentId,
    },
    select: { id: true, policyNumber: true },
  });

  if (existing) {
    return { ok: true, policyId: existing.id, policyNumber: existing.policyNumber };
  }

  // Create unique policyNumber (retry on rare collision)
  let policyNumber = generatePolicyNumber();
  for (let i = 0; i < 5; i++) {
    try {
      const created = await prisma.policy.create({
        data: {
          policyNumber,

          vrm: input.vrm,
          make: input.make ?? null,
          model: input.model ?? null,
          year: input.year ?? null,
          startAt: new Date(input.startAt),
          endAt: new Date(input.endAt),
          durationMs: input.durationMs,
          totalAmountPence: input.totalAmountPence,

          fullName: input.fullName,
          dob: new Date(input.dob),
          email: input.email,
          licenceType: input.licenceType,
          address: input.address,

          paymentProvider: input.paymentProvider,
          paymentId: input.paymentId,
          paymentStatus: input.paymentStatus,
          currency: input.currency ?? "GBP",

          events: {
            create: {
              type: "POLICY_CREATED",
              data: {
                paymentProvider: input.paymentProvider,
                paymentId: input.paymentId,
                paymentStatus: input.paymentStatus,
              },
            },
          },
        },
        select: { id: true, policyNumber: true },
      });

      return { ok: true, policyId: created.id, policyNumber: created.policyNumber };
    } catch (e: any) {
      // collision on policyNumber
      if (String(e?.code) === "P2002") {
        policyNumber = generatePolicyNumber();
        continue;
      }
      throw e;
    }
  }

  throw new Error("Failed to generate a unique policy number");
}
