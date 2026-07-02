import { Metadata } from "next";
import OrderDetail from "./_components/order-detail";

export const metadata: Metadata = {
  title: "POS | Order Details",
  description: "Order details here you can manage.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <OrderDetail id={id} />;
};

export default Page;
