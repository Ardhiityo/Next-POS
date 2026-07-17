"use server";

import { uploadFile } from "../storage/upload-file";
import { deleteFile } from "../storage/delete-file";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";
import {
  CreateMenuForm,
  createMenuFormSchema,
} from "@/validations/menu-validations";

export async function createMenu(
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

  const response = await uploadFile("images", "menus", form.image);

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
    console.log(error)
    const response = await deleteFile("images", imagePath);
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
