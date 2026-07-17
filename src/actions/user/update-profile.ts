"use server";

import { uploadFile } from "../storage/upload-file";
import { deleteFile } from "../storage/delete-file";
import { ActionResponse } from "@/types/general";
import { ProfileForm } from "@/validations/profile-validations";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { User } from "@/types/user";

type UpdateUserParams = {
  user: User;
  form: ProfileForm;
};

export async function updateProfile(
  params: UpdateUserParams,
): Promise<ActionResponse> {
  const { user, form } = params;

  let imageUrl: string = "";
  let imagePath: string = "";

  if (form.image instanceof File) {
    // upload new image
    const response = await uploadFile("images", "users", form.image);

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
      await deleteFile("images", path);
    }
  } else if (typeof form.image === "string") {
    imageUrl = form.image;
  }

  try {
    const data = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: form.name,
        image: imageUrl,
      },
    });

    const cookiesStore = await cookies();

    cookiesStore.set("user", JSON.stringify(data), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
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
        message:
          error instanceof Error ? error.message : "Failed to update user",
      },
    };
  }
}
