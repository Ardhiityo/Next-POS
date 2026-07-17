"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/general";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<ActionResponse<{ publicUrl: string; filePath: string }>> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();

  const filePath = `${path}/${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    success: true,
    data: {
      publicUrl,
      filePath: data.path,
    },
  };
}
