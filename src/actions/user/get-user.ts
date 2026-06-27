"use server";

import { auth } from "@/lib/auth";
import { UserWithRole } from "better-auth/plugins";
import { headers } from "next/headers";

type GetUserParams = {
  take: number;
  page: number;
  search: string | null;
};

type GetUserResponse = {
  data: UserWithRole[];
  paging: {
    total_item: number;
    total_page: number;
    page: number;
  };
};

export async function getUserAction(
  params: GetUserParams,
): Promise<GetUserResponse> {
  const take = params.take;
  const page = params.page;
  const skip = (page - 1) * take;
  const search = params.search ?? null;

  const data = await auth.api.listUsers({
    query: {
      limit: take,
      offset: skip,
      sortBy: "createdAt",
      sortDirection: "desc",
      ...(search && {
        searchField: "name",
        searchValue: search,
        searchOperator: "starts_with",
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
}
