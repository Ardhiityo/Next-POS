"use server";

import { auth } from "@/lib/auth";
import { ActionResponse } from "@/types/general";
import { cookies, headers } from "next/headers";

export async function signOutAction(): Promise<ActionResponse> {
  const { success } = await auth.api.signOut({
    headers: await headers(),
  });

  if (!success) return { success: false, error: { message: "Unauthorized" } };

  const cookiesStore = await cookies();
  cookiesStore.delete("user");

  return { success: true, data: null };
}
