import { Prisma } from "@/generated/prisma/client";

export type OrderMenuWithMenu = Prisma.OrderMenuGetPayload<{
  include: {
    menu;
  };
}>;

export type OrderMenu = Prisma.OrderMenuGetPayload<{
  include: {
    menu: {
      select: {
        name: true;
        price: true;
        discount: true;
        image: true;
        description: true;
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
