"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";
import {
  CreateOrderDineInForm,
  createOrderDineInFormSchema,
} from "@/validations/order-validations";

export async function createOrderDineIn(
  form: CreateOrderDineInForm,
): Promise<ActionResponse> {
  const validated = createOrderDineInFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  const tableId = await prisma.table.count({
    where: {
      id: form.tableId,
    },
  });

  if (tableId < 1) {
    return {
      success: false,
      error: {
        message: "Table not found",
      },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          ...form,
          orderId: `CAFEKU-${Date.now()}`,
        },
      });

      await tx.table.update({
        where: {
          id: form.tableId,
        },
        data: {
          status: form.status === "reserved" ? "reserved" : "unavailable",
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
