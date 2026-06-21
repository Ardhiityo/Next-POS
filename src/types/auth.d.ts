import { auth } from "@/lib/auth";

export type SignInState = {
  success: boolean;
  errors?: { [key: string]: string[] } | string;
};

// Type user yang sudah include role dan semua additionalFields
export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  role: Role;
};
