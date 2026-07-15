"use server";

import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { OrderWithTable } from "@/types/order";

type Status = "settled" | "cancelled" | "process" | "reserved";

type GetOrderByStatusParams = {
    take?: number;
    statuses: Status[];
};

export async function getOrderByStatuses(
    params: GetOrderByStatusParams,
): Promise<ActionResponse<OrderWithTable[]>> {
    const take = params.take;
    const statuses = params.statuses;

    const where: Prisma.OrderWhereInput = {};

    where.status = {
        in: statuses
    }
    try {
        const orders = await prisma.order.findMany({
            take,
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

        return {
            success: true,
            data: orders
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: {
                message: 'Failed get orders by status'
            }
        }
    }
}
