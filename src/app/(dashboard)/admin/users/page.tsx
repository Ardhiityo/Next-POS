import { Metadata } from "next";
import UserManagement from "./_components/user-management";

export const metadata: Metadata = {
  title: "POS | Users Management",
  description: "All users here you can manage.",
};

const Page = () => {
  return <UserManagement />;
};

export default Page;
