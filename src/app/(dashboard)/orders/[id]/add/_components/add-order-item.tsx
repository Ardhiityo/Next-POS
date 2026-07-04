"use client";

import CardMenu from "./card-menu";
import { getOrderMenuAction } from "@/actions/order-menu/get-order-menu";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderCart from "./order-cart";
import { Menu } from "@/generated/prisma/client";
import { CartMenu } from "@/types/cart";
import useDebounce from "@/hooks/use-debouce";

const AddOrderItem = ({ orderId }: { orderId: string }) => {
  const { data: orderMenus, error: orderMenuError } = useQuery({
    queryKey: ["get-order-menus", orderId],
    queryFn: async () => {
      return await getOrderMenuAction({
        orderId,
      });
    },
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

  const debounce = useDebounce();

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

  return (
    <section>
      <h1 className="text-3xl font-extrabold">Menu</h1>
      <section className="grid xl:grid-cols-4 lg:grid-cols-4 grid-cols-1 gap-5">
        <CardMenu handleAddToCart={handleAddToCart} />
        <OrderCart
          orderMenu={orderMenus ?? []}
          carts={carts}
          handleToCart={handleToCart}
          handleChangeNote={handleChangeNote}
        />
      </section>
    </section>
  );
};

export default AddOrderItem;
