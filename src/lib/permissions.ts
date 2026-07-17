import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  table: ['list'],
  menu: ['list']
} as const;

export const ac = createAccessControl(statement);

export const ADMIN = ac.newRole({
  table: ['list'],
  menu: ['list']
  , ...adminAc.statements
});

export const CASHIER = ac.newRole({});

export const KITCHEN = ac.newRole({});
