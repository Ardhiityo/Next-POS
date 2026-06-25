"use server";

import z from "zod";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { cookies, headers } from "next/headers";
import { SignInState } from "@/types/auth";
import { SignInForm } from "@/validations/auth-validation";
import { signInFormSchema } from "@/validations/auth-validation";

export async function signInAction(form: SignInForm): Promise<SignInState> {
  const validated = signInFormSchema.safeParse(form);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const response = await auth.api.signInEmail({
      body: {
        ...validated.data,
      },
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
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        errors: error.message,
      };
    } else if (error instanceof Error) {
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
