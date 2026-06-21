"use client";

import { TableList } from "@/components/common/table-list";
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
import { AuthUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const UserManagement = () => {
  const { data: users = [], isPending } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      return await response.json();
    },
  });

  const filteredUsers = useMemo(() => {
    return users.map((user: AuthUser, index: number) => {
      return [index + 1, user.name, user.email, user.role];
    });
  }, [users]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-1/4 self-end">
        <Input placeholder="Search..." />
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline">Add User</Button>
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
        <TableList
          headers={HEADER_TABLE_USER}
          data={filteredUsers}
          isPending={isPending}
        />
      </div>
    </section>
  );
};

export default UserManagement;
