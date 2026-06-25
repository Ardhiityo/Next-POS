import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

export const ADMIN = ac.newRole({ ...adminAc.statements });

export const USER = ac.newRole({});
