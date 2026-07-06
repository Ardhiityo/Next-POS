import { environment } from "@/configs/environment";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_KEY,
);
