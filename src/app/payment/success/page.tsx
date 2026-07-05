import { Metadata } from "next";
import Success from "./_components/success";

export const metadata: Metadata = {
  title: "POS | Payment Success",
  description: "Payment result information.",
};

const Page = () => {
  return <Success />;
};

export default Page;
