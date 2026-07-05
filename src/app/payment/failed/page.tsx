import { Metadata } from "next";
import Failed from "./_components/failed";

export const metadata: Metadata = {
  title: "POS | Payment Failed",
  description: "Payment result information.",
};

const Page = () => {
  return <Failed />;
};

export default Page;
