"use server";

import { ActionResponse } from "@/types/general";
import prisma from "@/lib/prisma";
import { OrderWithTable } from "@/types/order";

type UpdateOrderParams = {
  order: OrderWithTable;
  status: "process" | "cancelled";
};

export async function updateOrderAction(
  params: UpdateOrderParams,
): Promise<ActionResponse> {
  const { order, status } = params;

  try {
    await prisma.$transaction(async (tx) => {
      if (!order.tableId) {
        throw new Error("Table not found");
      }
      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status,
        },
      });
      await tx.table.update({
        where: {
          id: order.tableId,
        },
        data: {
          status:
            status === "cancelled"
              ? "available"
              : status === "process"
                ? "unavailable"
                : "reserved",
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
          error instanceof Error ? error.message : "Failed to update order",
      },
    };
  }
}
