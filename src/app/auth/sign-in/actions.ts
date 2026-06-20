"use server";

import z from "zod";
import { SignInState } from "@/types/auth";
import { SignInForm } from "@/validations/auth-validation";
import { signInFormSchema } from "@/validations/auth-validation";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";

const signInAction = async (form: SignInForm): Promise<SignInState> => {
  const validated = signInFormSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        ...validated.data,
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
};

export { signInAction };
