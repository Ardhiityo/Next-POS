"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";
import {
  UpdateTableForm,
  updateTableFormSchema,
} from "@/validations/table-validations";
import { Table } from "@/generated/prisma/client";

type UpdateTableParams = {
  table: Table;
  form: UpdateTableForm;
};

export async function updateTable(
  params: UpdateTableParams,
): Promise<ActionResponse> {
  const { table, form } = params;

  const validated = updateTableFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    await prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        ...form,
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
        message: "Failed to update table",
      },
    };
  }
}
