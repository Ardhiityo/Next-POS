"use client";

import { DataTable } from "@/components/common/data-table";
import DropwdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import { useDataTable } from "@/hooks/use-data-table";
import { AuthUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";

const UserManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const { data: users, isPending } = useQuery({
    queryKey: ["users", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        take: String(currentLimit),
        page: String(currentPage),
        search: currentSearch,
      });
      const response = await fetch(`/api/users?${params.toString()}`);
      const data = await response.json();
      return data;
    },
  });

  const filteredUsers = useMemo(() => {
    return users?.data.map((user: AuthUser, index: number) => {
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
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </Field>
                <Field>
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    id="username-1"
                    name="username"
                    defaultValue="@peduarte"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
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
