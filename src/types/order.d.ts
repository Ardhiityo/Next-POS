import { Order, Prisma } from "@/generated/prisma/client";

export type OrderWithTable = Prisma.OrderGetPayload<{
  include: {
    table: {
      select: {
        name: true;
      };
    };
  };
}>;

export type UpdateOrder = {
  order: Order;
  status: "process" | "cancelled";
};

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    table: true;
    orderMenus: {
      include: {
        menu: true;
      };
    };
  };
}>;
