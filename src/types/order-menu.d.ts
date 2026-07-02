import { Prisma } from "@/generated/prisma/client";

export type OrderMenu = Prisma.OrderMenuGetPayload<{
  include: {
    menu: {
      select: {
        name: true;
        price: true;
        discount: true;
        image: true;
      };
    };
    order: {
      select: {
        customerName: true;
        table: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;
