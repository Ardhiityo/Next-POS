
import { Role } from "@/constants/user-constant";
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

export const createUserFormSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password field must be at least 8 characters."),
    role: z.enum([Role.ADMIN, Role.CASHIER, Role.KITCHEN]),
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

export type CreateUserForm = z.infer<typeof createUserFormSchema>;

export const updateUserFormSchema = z.object({
  name: z.string().min(3),
  role: z.enum([Role.ADMIN, Role.CASHIER, Role.KITCHEN]),
  image: z.union([
    z.instanceof(File, {
      message: "Image field is required",
    }),
    z.string(),
  ]),
});

export type UpdateUserForm = z.infer<typeof updateUserFormSchema>;

export const deleteUserFormSchema = z.object({
  userId: z.string().min(3),
  image: z.string().nullable(),
});

export type DeleteUserForm = z.infer<typeof deleteUserFormSchema>;
