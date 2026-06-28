import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { Role } from "@/generated/prisma/enums";
import { admin } from "better-auth/plugins";
import { ADMIN, USER } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    admin({
      roles: { ADMIN, USER },
      defaultRole: Role.CASHIER,
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"] as Role[],
        input: false,
      },
    },
  },
});
