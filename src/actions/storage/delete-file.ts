"use server";

import { supabase } from "@/lib/supabase/default";
import { ActionResponse } from "@/types/general";

export async function deleteFile(
  bucket: string,
  filePath: string,
): Promise<ActionResponse> {

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
