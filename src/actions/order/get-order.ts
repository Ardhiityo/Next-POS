"use server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { OrderWithTable } from "@/types/order";

type GetOrderParams = {
  take: number;
  page: number;
  search?: string | null;
};

type GetOrderResponse = {
  data: OrderWithTable[];
  paging: {
    total_item: number;
    total_page: number;
    page: number;
  };
};

export async function getOrder(
  params: GetOrderParams,
): Promise<GetOrderResponse> {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;

  const where: Prisma.OrderWhereInput = {};

  if (search) {
    where.OR = [
      {
        orderId: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        customerName: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  const data = await prisma.order.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    where,
    include: {
      table: {
        select: {
          name: true,
        },
      },
    },
  });

  const count = await prisma.order.count({
    where,
  });

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
