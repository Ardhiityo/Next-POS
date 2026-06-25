"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { cookies, headers } from "next/headers";

export async function signOutAction() {
  try {
    const { success } = await auth.api.signOut({
      headers: await headers(),
    });

    if (success) {
      const cookiesStore = await cookies();
      cookiesStore.delete("user");
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
