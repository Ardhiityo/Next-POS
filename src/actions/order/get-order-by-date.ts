"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type GetOrderByDateParams = {
  startDate: Date;
};

type GetOrderByDateResponse = {
  orders: {
    createdAt: Date;
  }[];
};

export async function getOrderByDate(
  params: GetOrderByDateParams,
): Promise<ActionResponse<GetOrderByDateResponse>> {
  const { startDate } = params;

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "settled",
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
      },
    });

    return {
      success: true,
      data: {
        orders,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed get order by date",
      },
    };
  }
}
