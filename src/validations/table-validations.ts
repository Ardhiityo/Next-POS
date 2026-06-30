import z from "zod";

export const createTableFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  capacity: z.coerce.number().min(1),
  status: z.string(),
});

export type CreateTableForm = z.infer<typeof createTableFormSchema>;

export const updateTableFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  capacity: z.coerce.number().min(1),
  status: z.string(),
});

export type UpdateTableForm = z.infer<typeof updateTableFormSchema>;

export const deleteTableFormSchema = z.object({
  tableId: z.string().min(3),
});

export type DeleteTableForm = z.infer<typeof deleteTableFormSchema>;
