import { Role } from "@/generated/prisma/enums";
import { UserWithRole } from "better-auth/plugins";

export const INITIAL_SIGNIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_SIGNUP_FORM = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

export const INITIAL_STATE_USER = {
  id: "",
  name: "",
  email: "",
  role: Role.USER,
  image: "",
};

export const INITIAL_CREATE_USER_FORM = {
  name: "",
  email: "",
  password: "",
  role: Role.USER,
};

export const INITIAL_UPDATE_USER_FORM = (user?: UserWithRole) => {
  return {
    name: user?.name,
    role: (user?.role as Role) ?? Role.USER,
    image: user?.image ?? "",
  };
};

export const ROLE_LIST = [
  {
    label: "User",
    value: Role.USER,
  },
  {
    label: "Admin",
    value: Role.ADMIN,
  },
];
