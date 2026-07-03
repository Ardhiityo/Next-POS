"use server";

import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { SignInForm } from "@/validations/auth-validations";
import { signInFormSchema } from "@/validations/auth-validations";
import { ActionResponse } from "@/types/general";
import { validationError } from "@/lib/utils";

export async function signInAction(form: SignInForm): Promise<ActionResponse> {
  const validated = signInFormSchema.safeParse(form);

  if (!validated.success) {
    return validationError(validated.error);
  }

  try {
    const response = await auth.api.signInEmail({
      body: validated.data,
    });

    const cookiesStore = await cookies();

    cookiesStore.set("user", JSON.stringify(response.user), {
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
