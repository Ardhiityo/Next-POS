"use server";

import { UpdateUserForm } from "@/validations/auth-validations";
import { uploadFileAction } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
import { headers } from "next/headers";
import { UserWithRole } from "better-auth/plugins";
import { ActionResponse } from "@/types/general";

type UpdateUserParams = {
  user: UserWithRole;
  form: UpdateUserForm;
};

export async function updateUserAction(
  params: UpdateUserParams,
): Promise<ActionResponse> {
  const { user, form } = params;

  let imageUrl: string = "";
  let imagePath: string = "";

  if (form.image instanceof File) {
    // upload new image
    const response = await uploadFileAction("images", "users", form.image);

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
    const path = user?.image?.split("/images/").pop();
    if (path) {
      await deleteFileAction("images", path);
    }
  } else if (typeof form.image === "string") {
    imageUrl = form.image;
  }

  try {
    await auth.api.adminUpdateUser({
      body: {
        userId: user.id,
        data: {
          name: form.name,
          role: form.role,
          image: imageUrl,
        },
      },
      headers: await headers(),
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
          error instanceof Error ? error.message : "Failed to update user",
      },
    };
  }
}
