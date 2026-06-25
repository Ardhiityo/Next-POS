import { USER_HEADER_LIST } from "@/constants/user-constant";
import { UserWithRole } from "better-auth/plugins";

export type UserHeaderList = {
  key: keyof UserWithRole;
  label: string;
}[];

export type USER_HEADER_LIST_KEY = typeof USER_HEADER_LIST;
