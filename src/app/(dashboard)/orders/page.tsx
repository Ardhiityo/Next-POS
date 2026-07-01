import { Metadata } from "next";
import MenuManagement from "./_components/order-management";

export const metadata: Metadata = {
  title: "POS | Orders Management",
  description: "All orders here you can manage.",
};

const Page = () => {
  return <MenuManagement />;
};

export default Page;
