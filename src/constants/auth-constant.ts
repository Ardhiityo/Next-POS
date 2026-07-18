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
  role: Role.CASHIER,
};

export const INITIAL_CREATE_USER_FORM = {
  name: "",
  email: "",
  password: "",
  role: Role.CASHIER,
  image: "",
};

export const INITIAL_UPDATE_USER_FORM = (user?: UserWithRole) => {
  return {
    name: user?.name,
    role: (user?.role as Role) ?? Role.CASHIER,
    image: user?.image ?? "",
  };
};

export const ROLE_LIST = [
  {
    label: "Admin",
    value: Role.ADMIN,
  },
  {
    label: "Cashier",
    value: Role.CASHIER,
  },
  {
    label: "Kitchen",
    value: Role.KITCHEN,
  },
];

export const INITIAL_RESET_PASSWORD_FORM = {
  email: ""
};

export const INITIAL_RESET_PASSWORD_VERIFY_FORM = {
  password: "",
  passwordConfirmation: ""
};
