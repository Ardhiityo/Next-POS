"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { priceToIDR } from "@/lib/utils";
import { CartMenu } from "@/types/cart";
import { OrderMenu } from "@/types/order-menu";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

type OrderCartProps = {
  orderMenu: OrderMenu[];
  carts: CartMenu[];
  isPending: boolean;
  handleToCart: (menuId: string, action: "increase" | "decrease") => void;
  handleChangeNote: (menuId: string, note: string) => void;
  handleProcessOrder: () => void;
};

export default function OrderCart(props: OrderCartProps) {
  const {
    orderMenu,
    carts,
    isPending,
    handleToCart,
    handleChangeNote,
    handleProcessOrder,
  } = props;

  return (
    <Card className="h-fit w-full xl:col-span-1 col-span-4 self-center">
      <CardContent className="flex flex-col gap-4">
        <section>
          <h1 className="text-xl font-extrabold">Customer Information</h1>
          <h3 className="text-gray-400">Customer information order details</h3>
        </section>
        <div className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="customer_name">Customer name</Label>
            <Input
              id="customer_name"
              type="text"
              disabled
              value={orderMenu[0]?.order?.customerName ?? "-"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="table_name">Table</Label>
            <Input
              id="table_name"
              type="text"
              disabled
              value={orderMenu[0]?.order?.table?.name ?? "-"}
            />
          </div>
        </div>
        <Separator />
        <section className="flex flex-col gap-4">
          <section>
            <h1 className="text-xl font-extrabold">Cart Information</h1>
            <h3 className="text-gray-400">Customer cart information details</h3>
          </section>
          <div className="flex flex-col gap-5">
            {carts.length < 1 && (
              <div className="h-20 flex items-center justify-center">
                <p>Cart is empty, please add menu</p>
              </div>
            )}
            {carts.map((cart: CartMenu) => (
              <div
                className="flex flex-col gap-3"
                key={`order-cart-${cart.menuId}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <Image
                      width={50}
                      height={50}
                      src={cart.image}
                      alt={cart.name}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{cart.name}</p>
                      <p className="text-gray-400">{priceToIDR(cart.price)}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-md">
                    {priceToIDR(cart.total)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Add Note..."
                    className="w-2/3 h-10"
                    onChange={(e) =>
                      handleChangeNote(cart.menuId, e.target.value)
                    }
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="size-10 text-2xl font-semibold"
                      onClick={() => handleToCart(cart.menuId, "decrease")}
                    >
                      -
                    </Button>
                    <span className="font-semibold text-lg">
                      {cart.quantity}
                    </span>
                    <Button
                      variant="outline"
                      className="size-10 text-2xl font-semibold"
                      onClick={() => handleToCart(cart.menuId, "increase")}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
      <CardFooter>
        {carts.length > 0 && (
          <Button
            type="submit"
            variant={"default"}
            className="w-full bg-slate-500 text-white font-semibold hover:bg-slate-600"
            onClick={handleProcessOrder}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Process Order"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
