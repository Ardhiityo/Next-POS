"use server";

import { CreateUserForm } from "@/validations/auth-validations";
import { uploadFileAction } from "../storage/upload-file";
import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
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

  const responseUploadFileAction = await uploadFileAction(
    "images",
    "users",
    form.image,
  );

  if (!responseUploadFileAction.success) {
    return {
      success: false,
      error: {
        message: responseUploadFileAction.error.message,
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
          image: responseUploadFileAction.data?.publicUrl,
        },
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    try {
      const responseDeleteFileAction = await deleteFileAction(
        "images",
        responseUploadFileAction.data.filePath,
      );
      if (!responseDeleteFileAction.success) {
        return {
          success: false,
          error: {
            message: responseDeleteFileAction.error.message,
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
