"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getUserAction } from "@/actions/user/get-user";
import { UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DialogCreateUser from "./dialog-create-user";
import DialogUpdateUser from "./dialog-update-user";
import DialogDeleteUser from "./dialog-delete-user";
import DropwdownAction from "@/components/common/dropdown-action";
import ActionLabel from "./action-label";

const UserManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: users,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getUserAction({
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
    user: UserWithRole | null;
  }>(null);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.data.map((user: UserWithRole, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        user.name,
        user.email,
        user.role,
        <DropwdownAction
          key={`user-action-${user.id}`}
          menus={[
            {
              label: <ActionLabel type="edit" />,
              variant: "default",
              action: () => {
                setSelectedAction({
                  type: "update",
                  user,
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
                  user,
                });
              },
              type: "button",
            },
          ]}
        />,
      ];
    });
  }, [users, currentPage, currentLimit]);

  const totalPages = useMemo(() => {
    if (!users) return 1;
    return users.paging.total_page;
  }, [users]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-80 self-end">
        <Input
          placeholder="Search name"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => setSelectedAction({ type: "create", user: null })}
        >
          Create
        </Button>
      </div>
      <DataTable
        headers={HEADER_TABLE_USER}
        data={filteredUsers}
        isPending={isPending}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleChangeLimit={handleChangeLimit}
        currentLimit={currentLimit}
        totalPages={totalPages}
      />
      <DialogCreateUser
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "create"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogUpdateUser
        user={selectedAction?.user}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "update"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogDeleteUser
        user={selectedAction?.user}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "delete"}
        setOpen={() => setSelectedAction(null)}
      />
    </section>
  );
};

export default UserManagement;
