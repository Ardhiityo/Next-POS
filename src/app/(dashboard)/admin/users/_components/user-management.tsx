"use client";

import { DataTable } from "@/components/common/data-table";
import DropwdownAction from "@/components/common/dropdown-action";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import DialogCreateUser from "./dialog-create-user";
import { getUserAction } from "@/actions/user/get-user";
import { UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";

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
  } = useQuery({
    queryKey: ["users", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const response = await getUserAction({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
      });
      if (response?.error) {
        toast.error(response.error);
      }
      return response;
    },
  });

  const filteredUsers = useMemo(() => {
    return (users?.data || []).map((user: UserWithRole, index: number) => {
      return [
        index + 1,
        user.name,
        user.email,
        user.role,
        <DropwdownAction
          menus={[
            {
              label: (
                <div className="flex gap-1 items-center">
                  <PencilIcon />
                  Edit
                </div>
              ),
              variant: "default",
              action: () => {},
              type: "button",
            },
            {
              label: (
                <div className="flex gap-1 items-center">
                  <Trash2Icon />
                  Delete
                </div>
              ),
              variant: "destructive",
              action: () => {},
              type: "button",
            },
          ]}
        />,
      ];
    });
  }, [users]);

  const totalPages = useMemo(() => {
    return users?.paging?.total_page ?? 1;
  }, [users]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-1/4 self-end">
        <Input
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <DialogCreateUser refetch={refetch} />
      </div>
      <div>
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
      </div>
    </section>
  );
};

export default UserManagement;
