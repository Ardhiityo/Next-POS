import z from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(3),
  image: z.union([
    z.string(),
    z.instanceof(File, {
      message: "Image field is required",
    }),
  ]),
});

export type ProfileForm = z.infer<typeof profileFormSchema>;
