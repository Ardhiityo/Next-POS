"use server";

import { uploadFileAction } from "../storage/upload-file";
import { deleteFileAction } from "../storage/delete-file";
import {
  CreateMenuForm,
  createMenuFormSchema,
} from "@/validations/menu-validation";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";

export async function createMenuAction(
  form: CreateMenuForm,
): Promise<ActionResponse> {
  const validated = createMenuFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  let imageUrl = "";
  let imagePath = "";

  if (typeof form.image === "string") {
    return {
      success: false,
      error: {
        message: "Image is required",
      },
    };
  }

  const response = await uploadFileAction("images", "menus", form.image);

  if (!response.success) {
    return {
      success: false,
      error: {
        message: response.error.message,
      },
    };
  }

  imageUrl = response.data?.publicUrl;
  imagePath = response.data?.filePath;

  try {
    await prisma.menu.create({
      data: {
        ...form,
        isAvailable: form.isAvailable === "true" ? true : false,
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
        message: "Failed to create menu",
      },
    };
  }
}
