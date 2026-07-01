import { Prisma } from "@/generated/prisma/client";

type OrderWithTable = Prisma.OrderGetPayload<{
  include: {
    table: {
      select: {
        name: true;
      };
    };
  };
}>;
