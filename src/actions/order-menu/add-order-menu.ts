"use server";

import prisma from "@/lib/prisma";
import { CartMenu } from "@/types/cart";
import { ActionResponse } from "@/types/general";
import { revalidatePath } from "next/cache";

type AddOrderMenuParams = {
  carts: CartMenu[];
  orderId: string;
};

export async function addOrderMenuAction(
  params: AddOrderMenuParams,
): Promise<ActionResponse> {
  const { carts, orderId } = params;

  if (carts.length === 0) {
    return {
      success: false,
      error: {
        message: "Cart is empty",
      },
    };
  }

  if (!orderId) {
    return {
      success: false,
      error: {
        message: "Order not found",
      },
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
      },
      select: {
        id: true,
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

    await prisma.$transaction(async (tx) => {
      for (const cart of carts) {
        await tx.orderMenu.create({
          data: {
            orderId: order.id,
            menuId: cart.menuId,
            status: "pending",
            quantity: cart.quantity,
            notes: cart.notes,
          },
        });
      }
    });
    revalidatePath(`/dashboard/orders/${orderId}`);
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to add order menu",
      },
    };
  }
}
