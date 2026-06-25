import { Role } from "@/generated/prisma/enums";
import z from "zod";

export const signInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password field must be at least 8 characters."),
});

export type SignInForm = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password field must be at least 8 characters."),
    passwordConfirmation: z
      .string()
      .min(8, "Password field must be at least 8 characters."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["password"], // error akan muncul di field ini
  });

export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const createUserFormSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8, "Password field must be at least 8 characters."),
  role: z.enum([Role.ADMIN, Role.USER]),
});

export type CreateUserForm = z.infer<typeof createUserFormSchema>;
