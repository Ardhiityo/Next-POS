import { Metadata } from "next";
import TableManagement from "./_components/table-management";
import { authIsRequired, requirePermission } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "POS | Tables Management",
  description: "All tables here you can manage.",
};

const Page = async () => {
  const session = await authIsRequired();
  await requirePermission(session, {
    table: ['list']
  });
  return <TableManagement />;
};

export default Page;
