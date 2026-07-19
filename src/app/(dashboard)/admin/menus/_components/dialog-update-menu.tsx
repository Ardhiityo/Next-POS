"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import { Menu } from "@/generated/prisma/client";
import { updateMenu } from "@/actions/menu/update-menu";
import { applyFieldErrors } from "@/lib/utils";
import FormMenu from "./form-menu";
import {
  UpdateMenuForm,
  updateMenuFormSchema,
} from "@/validations/menu-validations";

type DialogUpdateMenuProps = {
  menu?: Menu | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogUpdateMenu = (props: DialogUpdateMenuProps) => {
  const { menu, open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setValue, setError } = useForm({
    resolver: zodResolver(updateMenuFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-menu"],
    mutationFn: async (form: UpdateMenuForm) => {
      if (!menu) throw new Error("Menu not found");
      const response = await updateMenu({
        menu,
        form,
      });
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Menu updated successfully");
        refetch();
      }
      return response;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (menu) {
      setValue("name", menu.name);
      setValue("description", menu.description);
      setValue("price", menu.price);
      setValue("discount", menu.discount);
      setValue("category", menu.category);
      setValue("isAvailable", String(menu.isAvailable));
      setValue("image", menu?.image ?? "");
      setImagePreview(menu?.image ?? undefined);
    }

    if (!open) {
      reset();
      setFile(undefined);
      setImagePreview(undefined);
    }
  }, [menu, open, reset, setValue]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  const onChangeImagePreview = (image: File | undefined) => {
    setFile(image);
  };

  return (
    <FormMenu
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: UpdateMenuForm) => mutate(data))}
      control={control}
      type="update"
      isPending={isPending}
      imagePreview={imagePreview}
      onChangeImagePreview={onChangeImagePreview}
    />
  );
};

export default DialogUpdateMenu;
