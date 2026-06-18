import z from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password field must be at least 6 characters."),
});

export type SignInForm = z.infer<typeof signInSchema>;
