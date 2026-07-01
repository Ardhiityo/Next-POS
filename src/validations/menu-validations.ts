import z from "zod";

export const createMenuFormSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().min(3),
    price: z.coerce.number().min(1),
    discount: z.coerce.number().min(0).max(100),
    category: z.string().min(3),
    isAvailable: z.string(),
    image: z.union([
      z.instanceof(File, {
        message: "Image field is required",
      }),
      z.string(),
    ]),
  })
  .refine((data) => data.image instanceof File, {
    message: "Image is required",
    path: ["image"],
  });

export type CreateMenuForm = z.infer<typeof createMenuFormSchema>;

export const updateMenuFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().min(1),
  discount: z.coerce.number().min(0).max(100),
  category: z.string().min(3),
  isAvailable: z.string(),
  image: z.union([
    z.string(),
    z.instanceof(File, {
      message: "Image field is required",
    }),
  ]),
});

export type UpdateMenuForm = z.infer<typeof updateMenuFormSchema>;

export const deleteMenuFormSchema = z.object({
  menuId: z.string().min(3),
  image: z.string().nullable(),
});

export type DeleteMenuForm = z.infer<typeof deleteMenuFormSchema>;
