"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { Menu } from "@/generated/prisma/client";
import { HEADER_TABLE_MENU } from "@/constants/menu-constants";
import { getMenuAction } from "@/actions/menu/get-menu";
import ActionLabel from "../../users/_components/action-label";
import { cn, priceToIDR } from "@/lib/utils";
import Image from "next/image";
import DialogCreateMenu from "./dialog-create-menu";
import DialogUpdateMenu from "./dialog-update-user";

const MenuManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: menus,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["menus", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getMenuAction({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
      });
    },
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const [selectedAction, setSelectedAction] = useState<null | {
    type: "create" | "update" | "delete";
    menu: Menu | null;
  }>(null);

  const filteredMenus = useMemo(() => {
    if (!menus) return [];
    return menus.data.map((menu: Menu, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex gap-2 items-center">
          <Image
            src={menu.image}
            alt={menu.name}
            width={500}
            height={500}
            className="size-14 rounded-lg"
            loading="eager"
          />
          {menu.name}
        </div>,
        menu.category,
        <div>
          <p>Base {priceToIDR(menu.price)}</p>
          <p>Discount {menu.discount}%</p>
          <p>
            After discount{" "}
            {priceToIDR(menu.price - (menu.price * menu.discount) / 100)}
          </p>
        </div>,
        <div
          className={cn(
            "text-center py-1 w-fit px-2 rounded-lg",
            menu.isAvailable ? "bg-green-600" : "bg-red-600",
          )}
        >
          {menu.isAvailable ? "Available" : "Not available"}
        </div>,
        <DropwdownAction
          menus={[
            {
              label: <ActionLabel type="edit" />,
              variant: "default",
              action: () => {
                setSelectedAction({
                  type: "update",
                  menu,
                });
              },
              type: "button",
            },
            {
              label: <ActionLabel type="delete" />,
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  type: "delete",
                  menu,
                });
              },
              type: "button",
            },
          ]}
        />,
      ];
    });
  }, [menus]);

  const totalPages = useMemo(() => {
    if (!menus) return 1;
    return menus.paging.total_page;
  }, [menus]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-1/4 self-end">
        <Input
          placeholder="Search name/category"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => setSelectedAction({ type: "create", menu: null })}
        >
          Create
        </Button>
      </div>
      <DataTable
        headers={HEADER_TABLE_MENU}
        data={filteredMenus}
        isPending={isPending}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleChangeLimit={handleChangeLimit}
        currentLimit={currentLimit}
        totalPages={totalPages}
      />
      <DialogCreateMenu
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "create"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogUpdateMenu
        menu={selectedAction?.menu}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "update"}
        setOpen={() => setSelectedAction(null)}
      />
      {/*
      <DialogDeleteUser
        menu={selectedAction?.menu}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "delete"}
        setOpen={() => setSelectedAction(null)}
      />*/}
    </section>
  );
};

export default MenuManagement;
