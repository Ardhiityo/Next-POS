"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";
import {
  CreateTableForm,
  createTableFormSchema,
} from "@/validations/table-validations";

export async function createTableAction(
  form: CreateTableForm,
): Promise<ActionResponse> {
  const validated = createTableFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    const tables = await prisma.table.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    let positionX = 100;
    let positionY = 100;

    if (tables) {
      positionX = tables.positionX += 100;
      positionY = tables.positionY += 100;
    }

    await prisma.table.create({
      data: {
        ...form,
        positionX,
        positionY,
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
        message: "Failed to create table",
      },
    };
  }
}
