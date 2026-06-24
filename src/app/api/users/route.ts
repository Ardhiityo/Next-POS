import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const take = Number(request.nextUrl.searchParams.get("take") ?? "10");
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const skip = (page - 1) * take;
  const search = request.nextUrl.searchParams.get("search") ?? null;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.name = {
      startsWith: search,
      mode: "insensitive",
    };
  }

  const users = await prisma.user.findMany({
    where,
    skip,
    take,
  });

  const total_item = await prisma.user.count();
  const total_page = Math.ceil(total_item / take);

  return NextResponse.json({
    data: users,
    paging: {
      total_item,
      total_page,
      page,
    },
  });
}
