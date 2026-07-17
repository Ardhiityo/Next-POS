"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";

type UpdateTableParams = {
    tableId: string,
    positionX: number;
    positionY: number;
};

export async function updateTablePosition(
    params: UpdateTableParams,
): Promise<ActionResponse> {

    const { tableId, positionX, positionY } = params;

    try {
        await prisma.table.update({
            where: {
                id: tableId,
            },
            data: {
                positionX,
                positionY
            },
        });

        return {
            success: true,
            data: null,
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: {
                message: "Failed to update position table",
            },
        };
    }
}
