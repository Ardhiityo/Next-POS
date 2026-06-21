import { USER_HEADER_LIST } from "@/constants/user-constant";
import { AuthUser } from "./auth";

export type UserHeaderList = {
  key: keyof AuthUser;
  label: string;
}[];

export type USER_HEADER_LIST_KEY = typeof USER_HEADER_LIST;
