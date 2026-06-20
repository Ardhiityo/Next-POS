import { authIsRequired } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await authIsRequired();

  if (session) {
    redirect("/admin");
  }
}
