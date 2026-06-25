import { Role } from "@/generated/prisma/enums";

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
