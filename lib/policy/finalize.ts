// lib/policy/finalize.ts
import { prisma } from "@/db/prisma";
import type { PolicyFinalizeInput, PolicyFinalizeResult } from "./types";
import { validateFinalizeInput } from "./validate";
import { generatePolicyNumber } from "./policyNumber";

/**
 * Finalize a policy purchase in an idempotent way.
 * Idempotency key: (paymentProvider, paymentId)
 */
export async function finalizePolicy(
  input: PolicyFinalizeInput
): Promise<PolicyFinalizeResult> {
  const v = validateFinalizeInput(input);
  if (!v.ok) throw new Error(v.errors.join(" • "));

  // ✅ Upgrade #2: use findUnique with the composite unique constraint
  // Requires @@unique([paymentProvider, paymentId]) in schema (you have it).
  const existing = await prisma.policy.findUnique({
    where: {
      paymentProvider_paymentId: {
        paymentProvider: input.paymentProvider,
        paymentId: input.paymentId,
      },
    },
    select: { id: true, policyNumber: true },
  });

  if (existing) {
    return {
      ok: true,
      policyId: existing.id,
      policyNumber: existing.policyNumber,
    };
  }

  // Create unique policyNumber (retry on rare collision)
  for (let i = 0; i < 5; i++) {
    const policyNumber = generatePolicyNumber();

    try {
      const created = await prisma.$transaction(async (tx) => {
        const policy = await tx.policy.create({
          data: {
            policyNumber,
            status: "PAID",

            vrm: input.vrm,
            make: input.make ?? null,
            model: input.model ?? null,
            year: input.year ?? null,
            startAt: new Date(input.startAt),
            endAt: new Date(input.endAt),
            durationMs: BigInt(Math.trunc(input.durationMs)),
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

            stripePaymentIntentId: input.stripePaymentIntentId ?? null,

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

        return policy;
      });

      return {
        ok: true,
        policyId: created.id,
        policyNumber: created.policyNumber,
      };
    } catch (e: any) {
      // Unique constraint violation
      if (String(e?.code) === "P2002") {
        // If the collision is provider+paymentId, fetch and return (webhook retry etc.)
        const again = await prisma.policy.findUnique({
          where: {
            paymentProvider_paymentId: {
              paymentProvider: input.paymentProvider,
              paymentId: input.paymentId,
            },
          },
          select: { id: true, policyNumber: true },
        });

        if (again) {
          return {
            ok: true,
            policyId: again.id,
            policyNumber: again.policyNumber,
          };
        }

        // ✅ only retry if the collision was actually policyNumber
        const target = e?.meta?.target as string[] | undefined;
        const isPolicyNumberCollision =
          Array.isArray(target) && target.includes("policyNumber");

        if (isPolicyNumberCollision) {
          continue; // retry with a new policy number
        }

        // Otherwise, surface the real unique constraint error
        throw e;
      }

      throw e;
    }
  }

  throw new Error("Failed to generate a unique policy number");
}
