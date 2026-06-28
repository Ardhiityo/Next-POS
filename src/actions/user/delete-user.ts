"use server";

import { auth } from "@/lib/auth";
import { deleteFileAction } from "../storage/delete-file";
import { headers } from "next/headers";

type DeleteUserParams = {
  userId: string;
  image?: string | null;
};

export async function deleteUserAction(
  params: DeleteUserParams,
): Promise<void> {
  const { userId, image } = params;

  let imagePath: string = "";

  if (image) {
    // delete image
    const path = image.split("/images/").pop();
    if (path) {
      imagePath = path;
    }
  }

  await auth.api.removeUser({
    body: {
      userId,
    },
    headers: await headers(),
  });

  if (imagePath) {
    await deleteFileAction("images", imagePath);
  }
}
