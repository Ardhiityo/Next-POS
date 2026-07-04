"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type UpdateStatusOrderMenuParams = {
  orderMenuId: string;
  status: "process" | "ready" | "served";
};

export async function updateStatusOrderMenuAction(
  params: UpdateStatusOrderMenuParams,
): Promise<ActionResponse> {
  const { orderMenuId, status } = params;

  try {
    await prisma.orderMenu.update({
      where: {
        id: orderMenuId,
      },
      data: {
        status,
      },
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
            : "Failed to update status order menu",
      },
    };
  }
}
