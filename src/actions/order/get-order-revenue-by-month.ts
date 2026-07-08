"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type GetOrderRevenueByMonthParams = {
  startMonth: Date;
  endMonth: Date;
};

export async function getOrderRevenueByMonth(
  params: GetOrderRevenueByMonthParams,
): Promise<ActionResponse<number>> {
  const { startMonth, endMonth } = params;

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "settled",
        createdAt: {
          gte: startMonth,
          lte: endMonth,
        },
      },
      select: {
        orderMenus: {
          select: {
            quantity: true,
            menu: {
              select: {
                price: true,
                discount: true,
              },
            },
          },
        },
      },
    });

    const revenue = orders.reduce((grandTotal, order) => {
      const subtotal = order.orderMenus.reduce((total, orderMenu) => {
        const productPrice = orderMenu.menu?.price ?? 0;
        const discountPercentage = (orderMenu.menu?.discount ?? 0) / 100;
        const discount = productPrice * discountPercentage;
        const productDiscount = productPrice - discount;
        const productTotalPrice = orderMenu.quantity * productDiscount;
        return productTotalPrice + total;
      }, 0);
      return grandTotal + subtotal;
    }, 0);

    return {
      success: true,
      data: revenue,
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
