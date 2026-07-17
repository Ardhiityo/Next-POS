"use server";

import { auth } from "@/lib/auth";
import { SignUpForm, signUpFormSchema } from "@/validations/auth-validations";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";

export async function signUp(form: SignUpForm): Promise<ActionResponse> {
  const validated = signUpFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: validated.data.name,
        email: validated.data.email,
        password: validated.data.password,
      },
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
