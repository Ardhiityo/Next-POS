import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { Role } from "@/generated/prisma/enums";
import { admin } from "better-auth/plugins";
import { ADMIN, CASHIER, KITCHEN } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    admin({
      roles: { ADMIN, CASHIER, KITCHEN },
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
        type: ["ADMIN", "CASHIER", "KITCHEN"] as Role[],
        input: false,
      },
    },
  },
});
