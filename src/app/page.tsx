import { Role } from "@/generated/prisma/enums";
import { authIsRequired } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await authIsRequired();

  const role = session.user.role;

  if (role === Role.ADMIN) {
    redirect("/admin");
  } else if (role === Role.CASHIER || role === Role.KITCHEN) {
    redirect("/orders");
  }
}
