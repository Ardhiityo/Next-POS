import z from "zod";

export const createOrderFormSchema = z.object({
  customerName: z.string().min(3),
  tableId: z.string(),
  status: z.string(),
});

export type CreateOrderForm = z.infer<typeof createOrderFormSchema>;
