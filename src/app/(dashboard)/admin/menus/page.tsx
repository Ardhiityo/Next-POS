import { Metadata } from "next";
import MenuManagement from "./_components/menu-management";

export const metadata: Metadata = {
  title: "POS | Menus Management",
  description: "All menus here you can manage.",
};

const Page = () => {
  return <MenuManagement />;
};

export default Page;
