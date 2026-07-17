"use server";

import { Prisma, Table } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type GetTableParams = {
  take: number;
  page: number;
  search: string | null;
};

type GetTableResponse = {
  data: Table[];
  paging: {
    total_item: number;
    total_page: number;
    page: number;
  };
};

export async function getTable(
  params: GetTableParams,
): Promise<GetTableResponse> {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;

  const where: Prisma.TableWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        status: {
          startsWith: search,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ];
  }

  const data = await prisma.table.findMany({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    where,
  });

  const count = await prisma.table.count({
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
