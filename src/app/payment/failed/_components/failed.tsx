"use client";

import { Button } from "@/components/ui/button";
import { CircleXIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Failed = () => {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <section className="flex flex-col gap-5 justify-center items-center max-w-sm">
      <CircleXIcon className="size-30 text-red-500" />
      <h1 className="text-3xl font-bold">Payment Failed</h1>
      <Button asChild size={"lg"}>
        <Link href={`/orders/${orderId}`}>Back to Order</Link>
      </Button>
    </section>
  );
};

export default Failed;
