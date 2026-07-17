"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type GetOrderTotalByStatus = {
  status: "settled" | "cancelled" | "process" | "reserved";
};

export async function getOrderTotalByStatus(
  params: GetOrderTotalByStatus,
): Promise<ActionResponse<number>> {
  const { status } = params;

  const thisMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );

  try {
    const total = await prisma.order.count({
      where: {
        status,
        createdAt: {
          gte: thisMonth,
        },
      },
    });

    return {
      success: true,
      data: total,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to get revenue",
      },
    };
  }
}
