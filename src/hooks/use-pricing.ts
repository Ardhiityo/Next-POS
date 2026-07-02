import { OrderMenu } from "@/types/order-menu";

export default function usePricing(orderMenu: OrderMenu[]) {
  const subtotal = orderMenu.reduce((total: number, orderMenu: OrderMenu) => {
    const productPrice = orderMenu.menu?.price ?? 0;
    const discountPercentage = (orderMenu.menu?.discount ?? 0) / 100;
    const discount = productPrice * discountPercentage;
    const productDiscount = productPrice - discount;
    return orderMenu.quantity * productDiscount + total;
  }, 0);

  const tax = subtotal * 0.12; // 12%
  const service = subtotal * 0.05; // 5%
  const total = subtotal + tax + service;

  return {
    subtotal,
    tax,
    service,
    total,
  };
}
