"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import DialogDelete from "@/components/common/dialog-delete";
import { Menu } from "@/generated/prisma/client";
import { deleteMenu } from "@/actions/menu/delete-menu";
import { DeleteMenuForm } from "@/validations/menu-validations";

type DialogDeleteMenuProps = {
  menu?: Menu | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogDeleteMenu = (props: DialogDeleteMenuProps) => {
  const { menu, open, setOpen, refetch } = props;

  const { handleSubmit, setValue } = useForm<DeleteMenuForm>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-menu"],
    mutationFn: async (form: DeleteMenuForm) => {
      if (!form) throw new Error("Menu not found");
      const response = await deleteMenu(form);
      if (!response.success) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Menu deleted successfully");
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
    if (menu) {
      setValue("menuId", menu.id);
      setValue("image", menu?.image ?? null);
    }
  }, [menu]);

  return (
    <DialogDelete
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: DeleteMenuForm) => mutate(data))}
      title="Menu"
      isPending={isPending}
    />
  );
};

export default DialogDeleteMenu;
