"use server";

import z from "zod";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { SignInState } from "@/types/auth";
import { SignUpForm, signUpFormSchema } from "@/validations/auth-validation";

export async function signUpAction(form: SignUpForm): Promise<SignInState> {
  const validated = signUpFormSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
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
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        errors: error.message,
      };
    }
    return {
      success: false,
      errors: "Internal Server Error",
    };
  }
}
