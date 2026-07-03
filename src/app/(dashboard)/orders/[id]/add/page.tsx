import { Metadata } from "next";
import AddOrderItem from "./_components/add-order-item";

export const metadata: Metadata = {
  title: "POS | Add Order Item",
  description: "Add order items here you can manage.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <AddOrderItem orderId={id} />;
};

export default Page;
