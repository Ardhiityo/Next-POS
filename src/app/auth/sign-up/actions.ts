"use server";

import z from "zod";
import { SignInState } from "@/app/types/auth";
import { SignUpForm, signUpFormSchema } from "@/validations/auth-validation";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";

const signUpAction = async (form: SignUpForm): Promise<SignInState> => {
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
};

export { signUpAction };
