"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteFileAction(bucket: string, filePath: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw new Error(
      error instanceof Error ? error.message : "Internal Server Error",
    );
  }
}
