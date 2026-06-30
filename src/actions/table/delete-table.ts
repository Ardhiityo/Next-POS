"use server";

import { ActionResponse } from "@/types/general";
import prisma from "@/lib/prisma";

type DeleteMenuParams = {
  tableId: string;
};

export async function deleteTableAction(
  params: DeleteMenuParams,
): Promise<ActionResponse> {
  const { tableId } = params;

  try {
    await prisma.table.delete({
      where: {
        id: tableId,
      },
    });
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete table",
      },
    };
  }
}
