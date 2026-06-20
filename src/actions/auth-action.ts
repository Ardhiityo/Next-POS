"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export async function signOut() {
  try {
    const { success } = await auth.api.signOut({
      headers: await headers(),
    });

    if (success) {
      return { error: null };
    } else {
      throw Error;
    }
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: "Internal Server Error" };
  }
}
