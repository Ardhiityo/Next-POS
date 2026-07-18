"use client";

import { getMenu } from "@/actions/menu/get-menu";
import PaginationDataTable from "@/components/common/pagination-data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MENU_CATEGORIES } from "@/constants/menu-constants";
import { Menu } from "@/generated/prisma/client";
import { useDataTable } from "@/hooks/use-data-table";
import { cn, priceToIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import LoadingCardMenu from "./loading-card-menu";
import Image from "next/image";

type CardMenuProps = {
  handleAddToCart: (menu: Menu) => void;
};

const CardMenu = ({ handleAddToCart }: CardMenuProps) => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    currentFilter,
    setCurrentPage,
    setCurrentFilter,
    handleSearch,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: menus,
    error: menuError,
    isPending,
  } = useQuery({
    queryKey: [
      "get-menus",
      currentLimit,
      currentPage,
      currentSearch,
      currentFilter,
    ],
    queryFn: async () => {
      return await getMenu({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
        filter: currentFilter,
      });
    },
  });

  useEffect(() => {
    if (menuError) toast.error(menuError.message);
  }, [menuError]);

  return (
    <main className="xl:col-span-3 col-span-4 w-full">
      <section className="mt-3 flex flex-col gap-3">
        <p className="text-gray-400">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentFilter === "" ? "default" : "outline"}
            onClick={() => setCurrentFilter("")}
          >
            All
          </Button>
          {MENU_CATEGORIES.map((category, index) => (
            <Button
              variant={currentFilter === category.value ? "default" : "outline"}
              key={`category-${index}`}
              onClick={() => setCurrentFilter(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        <div className="xl:w-1/3 w-1/2">
          <Input
            placeholder="Search menu..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </section>
      <section className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 md:grid-cols-2 w-full grid-cols-1 mt-8">
        {isPending && <LoadingCardMenu />}
        {menus?.data.length === 0 && (
          <div className="min-h-56 flex justify-center items-center">
            <p className="text-gray-400">Menu not found</p>
          </div>
        )}
        {menus?.data.map((menu: Menu, index) => (
          <Card
            className="relative lg:max-w-sm pt-0"
            key={`card-menu-${index}-${menu.name}`}
          >
            <Image
              src={menu.image}
              alt={menu?.name}
              width={300}
              height={300}
              className="relative z-20 aspect-square w-full object-cover"
            />
            <CardHeader>
              <CardTitle className="font-bold">{menu.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {menu.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <div className="flex flex-col gap-3 justify-center">
                <h3
                  className={cn("text-md text-slate-400 line-through", {
                    invisible: menu.discount < 1,
                  })}
                >
                  {priceToIDR(menu.price)}
                </h3>
                <h3 className="text-xl font-bold">
                  {priceToIDR(menu.price - menu.price * (menu.discount / 100))}
                </h3>
              </div>
              <Button className="w-fit" onClick={() => handleAddToCart(menu)}>
                <ShoppingCartIcon />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      <section className="mt-6">
        <PaginationDataTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleChangeLimit={handleChangeLimit}
          currentLimit={currentLimit}
          totalPages={menus?.paging?.total_page ?? 0}
          hideRowsPerPage={false}
        />
      </section>
    </main>
  );
};

export default CardMenu;
