"use server";

import prisma from "@/lib/prisma";
import { OrderMenu } from "@/types/order-menu";

type GetOrderMenuParams = {
  orderId: string;
};

export async function getOrderMenuAction(
  params: GetOrderMenuParams,
): Promise<OrderMenu[]> {
  const order = await prisma.order.findFirst({
    where: {
      orderId: params.orderId,
    },
    select: {
      id: true,
    },
  });

  if (!order) {
    return [];
  }

  const data = await prisma.orderMenu.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      orderId: order.id,
    },
    include: {
      menu: {
        select: {
          name: true,
          price: true,
          discount: true,
          image: true,
          description: true,
        },
      },
      order: {
        select: {
          customerName: true,
          table: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return data;
}
