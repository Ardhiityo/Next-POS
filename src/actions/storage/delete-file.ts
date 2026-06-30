"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/general";

export async function deleteFileAction(
  bucket: string,
  filePath: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
      },
    };
  }

  return {
    success: true,
    data: null,
  };
}
