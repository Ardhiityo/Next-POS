"use server";

import { UpdateUserForm } from "@/validations/auth-validation";
import { uploadFileAction } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
import { headers } from "next/headers";
import { UserWithRole } from "better-auth/plugins";

type UpdateUserParams = {
  user: UserWithRole;
  form: UpdateUserForm;
};

export async function updateUserAction(
  params: UpdateUserParams,
): Promise<void> {
  const { user, form } = params;

  let imageUrl: string = "";
  let imagePath: string = "";

  if (form.image instanceof File) {
    // upload new image
    const { publicUrl, filePath } = await uploadFileAction(
      "images",
      "users",
      form.image,
    );

    imageUrl = publicUrl;
    imagePath = filePath;

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
  } catch (error) {
    try {
      await deleteFileAction("images", imagePath);
      throw error;
    } catch (error) {
      throw error;
    }
  }
}
