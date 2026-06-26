"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteFileAction(bucket: string, filePath: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
