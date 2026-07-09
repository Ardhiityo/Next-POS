"use client";

import CardMenu from "./card-menu";
import OrderCart from "./order-cart";
import useDebounce from "@/hooks/use-debouce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Menu } from "@/generated/prisma/client";
import { CartMenu } from "@/types/cart";
import { addOrderMenuAction } from "@/actions/order-menu/add-order-menu";
import { useRouter } from "next/navigation";
import { getOrderByOrderId } from "@/actions/order/get-order-by-orderId";

const AddOrderItem = ({ orderId }: { orderId: string }) => {
  const debounce = useDebounce();
  const { push } = useRouter();

  const { data: order, error: orderMenuError } = useQuery({
    queryKey: ["get-order-detail", orderId],
    queryFn: async () => {
      const response = await getOrderByOrderId({
        orderId,
      });
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      return response.data;
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (orderMenuError) toast.error(orderMenuError.message);
  }, [orderMenuError]);

  const [carts, setCarts] = useState<CartMenu[]>([]);

  const handleAddToCart = (menu: Menu) => {
    const isExistingMenu = carts.find((cart) => cart.menuId === menu.id);
    if (isExistingMenu) {
      return setCarts((carts) => {
        return carts.map((cart: CartMenu) => {
          const quantity = cart.quantity + 1;
          const total = quantity * cart.price;
          if (cart.menuId === menu.id) {
            return {
              ...cart,
              quantity,
              total,
            };
          }
          return cart;
        });
      });
    } else {
      return setCarts([
        ...carts,
        {
          menuId: menu.id,
          quantity: 1,
          image: menu.image,
          name: menu.name,
          price: menu.price - menu.price * (menu.discount / 100),
          discount: menu.discount,
          total: menu.price - menu.price * (menu.discount / 100),
        },
      ]);
    }
  };

  const handleToCart = (menuId: string, action: "increase" | "decrease") => {
    if (action === "increase") {
      return setCarts((carts) => {
        return carts.map((cart) => {
          if (cart.menuId === menuId) {
            const quantity = cart.quantity + 1;
            const total = quantity * cart.price;

            return {
              ...cart,
              quantity,
              total,
            };
          }
          return cart;
        });
      });
    } else {
      const menu = carts.find((cart) => cart.menuId === menuId);
      if (menu?.quantity === 1) {
        setCarts(carts.filter((cart) => cart.menuId !== menuId));
        return;
      }
      return setCarts((carts) => {
        return carts.map((cart) => {
          if (cart.menuId === menuId && cart.quantity > 1) {
            const quantity = cart.quantity - 1;
            const total = quantity * cart.price;
            return {
              ...cart,
              quantity,
              total,
            };
          }
          return cart;
        });
      });
    }
  };

  const handleChangeNote = (menuId: string, note: string) => {
    debounce(() => {
      setCarts((carts) => {
        return carts.map((cart) => {
          if (cart.menuId === menuId) {
            return {
              ...cart,
              notes: note,
            };
          }
          return cart;
        });
      });
    }, 500);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-order-menus", orderId],
    mutationFn: async () => {
      const response = await addOrderMenuAction({
        orderId,
        carts,
      });
      if (response.success) {
        setCarts([]);
        push(`/orders/${orderId}`);
        toast.success("Order menu added successfully");
      } else if (response.error) {
        toast.error(response.error.message);
      }
    },
  });

  return (
    <section>
      <h1 className="text-3xl font-extrabold">Menu</h1>
      <section className="grid xl:grid-cols-4 lg:grid-cols-4 grid-cols-1 gap-5">
        <CardMenu handleAddToCart={handleAddToCart} />
        <OrderCart
          order={order}
          carts={carts}
          handleToCart={handleToCart}
          handleChangeNote={handleChangeNote}
          handleProcessOrder={() => mutate()}
          isPending={isPending}
        />
      </section>
    </section>
  );
};

export default AddOrderItem;
