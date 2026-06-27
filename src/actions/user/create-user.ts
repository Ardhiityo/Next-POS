"use server";

import { CreateUserForm } from "@/validations/auth-validation";
import { uploadFileAction } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";

export async function createUserAction(form: CreateUserForm): Promise<void> {
  const { publicUrl, filePath } = await uploadFileAction(
    "images",
    "users",
    form.image,
  );

  try {
    await auth.api.createUser({
      body: {
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
        data: {
          image: publicUrl,
        },
      },
    });
  } catch (error) {
    await deleteFileAction("images", filePath);
    throw error;
  }
}
