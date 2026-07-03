import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ADMIN, CASHIER, KITCHEN } from "./permissions";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      roles: { ADMIN, CASHIER, KITCHEN },
    }),
  ],
});
