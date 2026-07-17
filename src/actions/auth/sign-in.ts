"use server";

import { auth } from "@/lib/auth";
import { SignInForm } from "@/validations/auth-validations";
import { signInFormSchema } from "@/validations/auth-validations";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";

export async function signIn(form: SignInForm): Promise<ActionResponse> {
  const validated = signInFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    await auth.api.signInEmail({
      body: validated.data,
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
    return {
      success: false,
      error: {
        message: "Internal Server Error",
      },
    };
  }
}
