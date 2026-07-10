import { OrderWithRelations } from "@/types/order";

export default function usePricing(order: OrderWithRelations | undefined) {
  const subtotal =
    order?.orderMenus.reduce((total, orderMenu) => {
      return orderMenu.nominal + total;
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
