"use server";

import { Menu, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type GetMenuParams = {
  take: number;
  page: number;
  search: string | null;
  filter?: string;
};

type GetMenuResponse = {
  data: Menu[];
  paging: {
    total_item: number;
    total_page: number;
    page: number;
  };
};

export async function getMenu(
  params: GetMenuParams,
): Promise<GetMenuResponse> {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;
  const filter = params.filter ?? null;

  const where: Prisma.MenuWhereInput = {};

  if (filter) {
    where.category = filter;
  }

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

  const data = await prisma.menu.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    where,
  });

  const count = await prisma.menu.count({
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
