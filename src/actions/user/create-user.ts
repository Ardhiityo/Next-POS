"use server";

import { CreateUserForm } from "@/validations/auth-validations";
import { uploadFile } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFile } from "../storage/delete-file";
import { ActionResponse } from "@/types/general";

export async function createUserAction(
  form: CreateUserForm,
): Promise<ActionResponse> {
  if (typeof form.image === "string") {
    return {
      success: false,
      error: {
        message: "Image is required",
      },
    };
  }

  const responseUploadFile = await uploadFile(
    "images",
    "users",
    form.image,
  );

  if (!responseUploadFile.success) {
    return {
      success: false,
      error: {
        message: responseUploadFile.error.message,
      },
    };
  }

  try {
    await auth.api.createUser({
      body: {
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
        data: {
          image: responseUploadFile.data?.publicUrl,
        },
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    try {
      const responseDeleteFile = await deleteFile(
        "images",
        responseUploadFile.data.filePath,
      );
      if (!responseDeleteFile.success) {
        return {
          success: false,
          error: {
            message: responseDeleteFile.error.message,
          },
        };
      }
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to create user",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Failed to delete image",
        },
      };
    }
  }
}
