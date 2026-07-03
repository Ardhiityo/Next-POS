"use client";

import { getMenuAction } from "@/actions/menu/get-menu";
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
import { priceToIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import LoadingCardMenu from "./loading-card-menu";

const CardMenu = () => {
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
      return await getMenuAction({
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
    <div className="w-2/3 flex flex-col gap-5">
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
      </section>
      <section>
        <div className="w-1/3">
          <Input
            placeholder="Search menu..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-8 mt-4">
          {isPending && <LoadingCardMenu />}
          {menus?.data.length === 0 && (
            <div className="h-50 w-full flex justify-center items-center">
              <p className="text-gray-400">Menu not found</p>
            </div>
          )}
          {menus?.data.map((menu: Menu, index) => (
            <Card
              className="relative w-1/4 max-w-sm pt-0"
              key={`card-menu-${index}-${menu.name}`}
            >
              <img
                src={menu.image}
                alt={menu?.name}
                className="relative z-20 aspect-square w-full object-cover"
              />
              <CardHeader>
                <CardTitle className="font-bold">{menu.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {menu.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <h3 className="text-xl font-bold">
                  {priceToIDR(menu.price - menu.price * (menu.discount / 100))}
                </h3>
                <Button className="w-fit">
                  <ShoppingCartIcon />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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
    </div>
  );
};

export default CardMenu;
