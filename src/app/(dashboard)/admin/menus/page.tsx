import { Metadata } from "next";
import MenuManagement from "./_components/menu-management";
import { authIsRequired, requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Menus Management",
  description: "All menus here you can manage.",
};

const Page = async () => {
  const session = await authIsRequired();
  await requirePermission(session, {
    menu: ['list']
  });
  return <MenuManagement />;
};

export default Page;
