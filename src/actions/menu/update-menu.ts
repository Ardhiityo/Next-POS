"use server";

import { uploadFileAction } from "../storage/upload-file";
import { deleteFileAction } from "../storage/delete-file";
import { ActionResponse } from "@/types/general";
import { Menu } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { validationError } from "@/lib/utils";
import {
  UpdateMenuForm,
  updateMenuFormSchema,
} from "@/validations/menu-validations";

type UpdateMenuParams = {
  menu: Menu;
  form: UpdateMenuForm;
};

export async function updateMenuAction(
  params: UpdateMenuParams,
): Promise<ActionResponse> {
  const { menu, form } = params;

  const validated = updateMenuFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  let imageUrl: string = "";
  let imagePath: string = "";

  if (form.image instanceof File) {
    // upload new image
    const response = await uploadFileAction("images", "menus", form.image);

    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message,
        },
      };
    }

    imageUrl = response.data.publicUrl;
    imagePath = response.data.filePath;

    // delete old image
    const path = menu?.image?.split("/images/").pop();
    if (path) {
      await deleteFileAction("images", path);
    }
  } else if (typeof form.image === "string") {
    imageUrl = form.image;
  }

  try {
    await prisma.menu.update({
      where: {
        id: menu.id,
      },
      data: {
        ...validated.data,
        isAvailable: validated.data.isAvailable === "true" ? true : false,
        image: imageUrl,
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    const response = await deleteFileAction("images", imagePath);
    if (!response.success) {
      return {
        success: false,
        error: {
          message: response.error.message,
        },
      };
    }
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update menu",
      },
    };
  }
}
