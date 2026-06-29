"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import {
  CreateMenuForm,
  createMenuFormSchema,
} from "@/validations/menu-validation";
import { INITIAL_CREATE_MENU_FORM } from "@/constants/menu-constants";
import { createMenuAction } from "@/actions/menu/create-menu";
import FormMenu from "./form-menu";
import { applyFieldErrors } from "@/lib/utils";

type DialogCreateMenuProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogCreateMenu = (props: DialogCreateMenuProps) => {
  const { open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setError } = useForm({
    resolver: zodResolver(createMenuFormSchema),
    defaultValues: INITIAL_CREATE_MENU_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-menu"],
    mutationFn: async (data: CreateMenuForm) => {
      const response = await createMenuAction(data);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Menu created successfully");
        setOpen(false);
        refetch();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  const onChangeImagePreview = (image: File | undefined) => {
    setFile(image);
  };

  useEffect(() => {
    if (!open) {
      reset();
      setFile(undefined);
      setImagePreview(undefined);
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, open]);

  return (
    <FormMenu
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: CreateMenuForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
      onChangeImagePreview={onChangeImagePreview}
      imagePreview={imagePreview}
    />
  );
};

export default DialogCreateMenu;
