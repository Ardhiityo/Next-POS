import { Metadata } from "next";
import MenuManagement from "./_components/menu-management";
import { requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Menus Management",
  description: "All menus here you can manage.",
};

const Page = async () => {
  await requirePermission({
    menu: ['list']
  })
  return <MenuManagement />;
};

export default Page;
