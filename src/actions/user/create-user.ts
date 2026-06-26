"use server";

import { CreateUserForm } from "@/validations/auth-validation";
import { uploadFileAction } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
import { APIError } from "better-auth";

export async function createUserAction(form: CreateUserForm) {
  const {
    publicUrl,
    filePath,
    error: errorUpload,
  } = await uploadFileAction("images", "users", form.image);

  if (errorUpload) {
    return { error: errorUpload };
  }

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
    return { error: null };
  } catch (error) {
    try {
      await deleteFileAction("images", filePath);
      if (error instanceof APIError) {
        return { error: error.message };
      } else if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "Internal Server Error" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: "Internal Server Error" };
      }
    }
  }
}
