"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadFileAction(
  bucket: string,
  path: string,
  file: File,
) {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();

  const filePath = `${path}/${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw new Error(
      error instanceof Error ? error.message : "Internal Server Error",
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { publicUrl, filePath: data.path };
}
