"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";
import {
  CreateOrderTakeawayForm,
  createOrderTakeawayFormSchema,
} from "@/validations/order-validations";

export async function createOrderTakeaway(
  form: CreateOrderTakeawayForm,
): Promise<ActionResponse> {
  const validated = createOrderTakeawayFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          ...form,
          status: "process",
          orderId: `CAFEKU-${Date.now()}`,
        },
      });
    });
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create order",
      },
    };
  }
}
