"use server";

import { Order } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type GetOrderByOrderIdParams = {
  orderId: string;
};

export async function getOrderByOrderId({
  orderId,
}: GetOrderByOrderIdParams): Promise<ActionResponse<{ order: Order }>> {
  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
      },
    });

    if (!order) {
      return {
        success: false,
        error: {
          message: "Order not found",
        },
      };
    }

    return {
      success: true,
      data: {
        order,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Failed to get order",
      },
    };
  }
}
