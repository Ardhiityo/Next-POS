import { Metadata } from "next";
import OrderDetail from "./_components/order-detail";
import Script from "next/script";
import { environment } from "@/configs/environment";

export const metadata: Metadata = {
  title: "POS | Order Details",
  description: "Order details here you can manage.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

declare global {
  interface Window {
    snap: any;
  }
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <>
      <OrderDetail orderId={id} />
      <Script
        src={environment.MIDTRANS_SCRIPT_URL}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </>
  );
};

export default Page;
