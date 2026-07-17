"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { deleteUserAction } from "@/actions/user/delete-user";
import { useForm } from "react-hook-form";
import DialogDelete from "@/components/common/dialog-delete";
import { DeleteUserForm } from "@/validations/auth-validations";
import type { UserWithRole } from "better-auth/plugins";

type DialogDeleteUserProps = {
  user?: UserWithRole | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogDeleteUser = (props: DialogDeleteUserProps) => {
  const { user, open, setOpen, refetch } = props;

  const { handleSubmit, setValue } = useForm<DeleteUserForm>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (form: DeleteUserForm) => {
      if (!form) throw new Error("User not found");
      const response = await deleteUserAction(form);
      if (!response.success) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("User deleted successfully");
        setOpen(false);
        refetch();
      }
      return response;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (user) {
      setValue("userId", user.id);
      setValue("image", user?.image ?? null);
    }
  }, [user, setValue]);

  return (
    <DialogDelete
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: DeleteUserForm) => mutate(data))}
      title="User"
      isPending={isPending}
    />
  );
};

export default DialogDeleteUser;
