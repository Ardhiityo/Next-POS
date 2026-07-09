"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { OrderWithRelations } from "@/types/order";

type GetOrderByOrderIdParams = {
  orderId: string;
};

export async function getOrderByOrderId({
  orderId,
}: GetOrderByOrderIdParams): Promise<ActionResponse<OrderWithRelations>> {
  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
      },
      include: {
        table: true,
        orderMenus: {
          include: {
            menu: true,
          },
        },
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
      data: order,
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
