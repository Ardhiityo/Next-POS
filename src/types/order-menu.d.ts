export type OrderMenuWithMenu = Prisma.OrderMenuGetPayload<{
  include: {
    menu: {
      select: {
        name: true;
        price: true;
        discount: true;
      };
    };
  };
}>;
