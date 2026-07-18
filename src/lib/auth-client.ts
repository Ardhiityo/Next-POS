import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ADMIN, CASHIER, KITCHEN } from "./permissions";
import { auth } from "./auth";
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      roles: { ADMIN, CASHIER, KITCHEN },
    }),
    nextCookies(),
  ],
});
