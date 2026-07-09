import { OrderWithRelations } from "@/types/order";

export default function usePricing(order: OrderWithRelations | undefined) {
  const subtotal =
    order?.orderMenus.reduce((total, orderMenu) => {
      const productPrice = orderMenu.menu?.price ?? 0;
      const discountPercentage = (orderMenu.menu?.discount ?? 0) / 100;
      const discount = productPrice * discountPercentage;
      const productDiscount = productPrice - discount;
      const productTotalPrice = orderMenu.quantity * productDiscount;
      return productTotalPrice + total;
    }, 0) ?? 0;

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
