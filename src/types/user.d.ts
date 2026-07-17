import { USER_HEADER_LIST } from "@/constants/user-constant";
import { UserWithRole } from "better-auth/plugins";

export type UserHeaderList = {
  key: keyof UserWithRole;
  label: string;
}[];

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  role: "ADMIN" | "CASHIER" | "KITCHEN";
  banned: boolean | null | undefined;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
}

export type USER_HEADER_LIST_KEY = typeof USER_HEADER_LIST;
