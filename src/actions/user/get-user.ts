"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

type GetUserParams = {
  take: number;
  page: number;
  search: string | null;
};

export async function getUserAction(params: GetUserParams) {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;

  try {
    const data = await auth.api.listUsers({
      query: {
        limit: take,
        offset: skip,
        sortBy: "createdAt",
        sortDirection: "desc",
        ...(search && {
          filterField: "name",
          filterValue: search,
          filterOperator: "starts_with",
        }),
      },
      headers: await headers(),
    });

    const total_item = data.total;
    const total_page = Math.ceil(total_item / take);

    return {
      data: data.users,
      paging: {
        total_item,
        total_page,
        page,
      },
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        error: error.message,
      };
    } else if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "Internal Server Error",
    };
  }
}
