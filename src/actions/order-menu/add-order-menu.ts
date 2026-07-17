"use server";

import prisma from "@/lib/prisma";
import { CartMenu } from "@/types/cart";
import { ActionResponse } from "@/types/general";

type AddOrderMenuParams = {
  carts: CartMenu[];
  orderId: string;
};

export async function addOrderMenu(
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

    const orderMenuIds = carts.map((cart) => cart.menuId);

    const menus = await prisma.menu.findMany({
      where: {
        id: {
          in: orderMenuIds,
        },
      },
    });

    const foundMenuIds = new Set(menus.map((menu) => menu.id));

    const missingMenus = carts.filter((menu) => !foundMenuIds.has(menu.menuId));

    if (missingMenus.length > 0) {
      const menuNotFounds = missingMenus.map((menu) => menu.name).join(", ");
      return {
        success: false,
        error: {
          message: `Menu ${menuNotFounds} not found`,
        },
      };
    }

    await prisma.$transaction(async (tx) => {
      for (const cart of carts) {
        const menu = menus.find((menu) => menu.id === cart.menuId);
        if (!menu) throw new Error(`Menu with id : ${cart.menuId} not found`);
        const price = menu.price;
        const discountPercentage = menu.discount / 100;
        const totalDiscount = price * discountPercentage;
        const totalPrice = price - totalDiscount;
        await tx.orderMenu.create({
          data: {
            orderId: order.id,
            menuId: cart.menuId,
            status: "pending",
            quantity: cart.quantity,
            notes: cart.notes,
            nominal: totalPrice * cart.quantity,
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
          error instanceof Error ? error.message : "Failed to add order menu",
      },
    };
  }
}
