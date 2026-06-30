"use server";

import { deleteFileAction } from "../storage/delete-file";
import { ActionResponse } from "@/types/general";
import prisma from "@/lib/prisma";

type DeleteMenuParams = {
  menuId: string;
  image?: string | null;
};

export async function deleteMenuAction(
  params: DeleteMenuParams,
): Promise<ActionResponse> {
  const { menuId, image } = params;

  let imagePath: string = "";

  if (image) {
    // delete image
    const path = image.split("/images/").pop();
    if (path) {
      imagePath = path;
    }
  }

  try {
    await prisma.menu.delete({
      where: {
        id: menuId,
      },
    });
    if (imagePath) {
      const response = await deleteFileAction("images", imagePath);
      if (!response.success) {
        return {
          success: false,
          error: {
            message: response.error.message,
          },
        };
      }
    }
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete menu",
      },
    };
  }
}
