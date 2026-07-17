import { Metadata } from "next";
import TableManagement from "./_components/table-management";
import { requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Tables Management",
  description: "All tables here you can manage.",
};

const Page = async () => {
  await requirePermission({
    table: ['list']
  })
  return <TableManagement />;
};

export default Page;
