"use server";

import { ActionResponse } from "@/types/general";
import prisma from "@/lib/prisma";
import { environment } from "@/configs/environment";
type UpdateOrderStatusParams = {
  orderId: string;
};

export async function updateOrderStatusAction(
  params: UpdateOrderStatusParams,
): Promise<ActionResponse> {
  const { orderId } = params;

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const transaction = await fetch(
      `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${environment.MIDTRANS_SERVER_KEY}:`,
          ).toString("base64")}`,
          Accept: "application/json",
        },
      },
    );

    const result = await transaction.json();

    if (result.transaction_status != "settlement") {
      throw new Error("Order status is not successfully");
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "settled",
        },
      });
      if (order.tableId) {
        await tx.table.update({
          where: {
            id: order.tableId,
          },
          data: {
            status: "available",
          },
        });
      }
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
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      },
    };
  }
}
