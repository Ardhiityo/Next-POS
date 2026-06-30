import { Metadata } from "next";
import TableManagement from "./_components/table-management";

export const metadata: Metadata = {
  title: "POS | Tables Management",
  description: "All tables here you can manage.",
};

const Page = () => {
  return <TableManagement />;
};

export default Page;
