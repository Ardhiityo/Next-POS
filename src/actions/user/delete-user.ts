"use server";

import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
import { headers } from "next/headers";
import { ActionResponse } from "@/types/general";

type DeleteUserParams = {
  userId: string;
  image?: string | null;
};

export async function deleteUserAction(
  params: DeleteUserParams,
): Promise<ActionResponse> {
  const { userId, image } = params;

  let imagePath: string = "";

  if (image) {
    // delete image
    const path = image.split("/images/").pop();
    if (path) {
      imagePath = path;
    }
  }

  try {
    await auth.api.removeUser({
      body: {
        userId,
      },
      headers: await headers(),
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
          error instanceof Error ? error.message : "Failed to delete user",
      },
    };
  }
}
