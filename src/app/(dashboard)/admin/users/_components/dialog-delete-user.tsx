"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { UserWithRole } from "better-auth/plugins";
import { deleteUserAction } from "@/actions/user/delete-user";
import { useForm } from "react-hook-form";
import DialogDelete from "@/components/common/dialog-delete";
import { DeleteUserForm } from "@/validations/auth-validation";

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
    mutationFn: async (data: DeleteUserForm) => {
      if (!data) throw new Error("User not found");
      const response = await deleteUserAction(data);
      if (!response.success) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("User deleted successfully");
        setOpen(false);
        refetch();
      }
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
  }, [user]);

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
