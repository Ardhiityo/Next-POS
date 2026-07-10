import z from "zod";

export const createOrderDineInFormSchema = z.object({
  customerName: z.string().min(3, "Customer name field is required."),
  tableId: z.string().min(1, "Table field is required."),
  status: z.string().min(1, "Status field is required."),
});

export type CreateOrderDineInForm = z.infer<typeof createOrderDineInFormSchema>;

export const createOrderTakeawayFormSchema = z.object({
  customerName: z.string().min(3, "Customer name field is required."),
});

export type CreateOrderTakeawayForm = z.infer<
  typeof createOrderTakeawayFormSchema
>;
