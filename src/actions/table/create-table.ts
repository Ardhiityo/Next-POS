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
    await prisma.table.create({
      data: {
        ...form,
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
        message: "Failed to create table",
      },
    };
  }
}
