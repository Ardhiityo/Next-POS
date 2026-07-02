"use server";

import { Menu, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { OrderMenuWithMenu } from "@/types/order-menu";

type GetOrderMenuResponse = {
  data: OrderMenuWithMenu[];
  paging: {
    total_item: number;
    total_page: number;
    page: number;
  };
};

type GetOrderMenuParams = {
  orderId: string;
  take: number;
  page: number;
  search: string | null;
};

export async function getOrderMenuAction(
  params: GetOrderMenuParams,
): Promise<GetOrderMenuResponse> {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;

  const order = await prisma.order.findFirst({
    where: {
      orderId: params.orderId,
    },
    select: {
      id: true,
    },
  });

  if (!order) {
    return {
      data: [],
      paging: {
        total_item: 0,
        total_page: 0,
        page: 0,
      },
    };
  }

  const where: Prisma.MenuWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  const data = await prisma.orderMenu.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      orderId: order.id,
    },
    include: {
      menu: {
        where,
      },
    },
  });

  const count = await prisma.menu.count({ where });

  const total_item = count;
  const total_page = Math.ceil(total_item / take);

  return {
    data: data,
    paging: {
      total_item,
      total_page,
      page,
    },
  };
}
