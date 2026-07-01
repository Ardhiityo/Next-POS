"use server";

import { Table } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type GetTableResponse = {
  data: Table[];
};

export async function getAllTableAction(): Promise<GetTableResponse> {
  const response = await prisma.table.findMany();

  return {
    data: response,
  };
}
