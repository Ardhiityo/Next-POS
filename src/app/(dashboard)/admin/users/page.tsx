import { Metadata } from "next";
import UserManagement from "./_components/user-management";
import { authIsRequired, requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Users Management",
  description: "All users here you can manage.",
};

const Page = async () => {
  const session = await authIsRequired();
  await requirePermission(session, {
    user: ['list']
  });
  return <UserManagement />;
};

export default Page;
