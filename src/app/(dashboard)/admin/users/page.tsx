import { Metadata } from "next";
import UserManagement from "./_components/user-management";
import { requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Users Management",
  description: "All users here you can manage.",
};

const Page = async () => {
  await requirePermission({
    user: ['list']
  })
  return <UserManagement />;
};

export default Page;
