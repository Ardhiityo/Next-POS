"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type GetOrderByOrderIdParams = {
  orderId: string;
};

type GetOrderByOrderIdResponse = {
  id: string;
  customerName: string;
  status: string;
  table: {
    name: string;
  } | null;
} | null;

export async function getOrderByOrderId({
  orderId,
}: GetOrderByOrderIdParams): Promise<
  ActionResponse<GetOrderByOrderIdResponse>
> {
  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
      },
      select: {
        id: true,
        customerName: true,
        status: true,
        table: {
          select: {
            name: true,
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
