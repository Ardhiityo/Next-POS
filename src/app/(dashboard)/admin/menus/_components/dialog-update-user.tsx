"use client";

import {
  UpdateUserForm,
  updateUserFormSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import FormUser from "./form-menu";
import { updateUserAction } from "@/actions/user/update-user";
import { UserWithRole } from "better-auth/plugins";
import { Role } from "@/generated/prisma/enums";

type DialogUpdateUserProps = {
  user?: UserWithRole | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogUpdateUser = (props: DialogUpdateUserProps) => {
  const { user, open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setValue } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (updateUserForm: UpdateUserForm) => {
      if (!user) throw new Error("User not found");
      return await updateUserAction({
        user,
        form: updateUserForm,
      });
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      refetch();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("role", user?.role as Role);
      setValue("image", user?.image ?? "");
      setImagePreview(user?.image ?? undefined);
    }

    if (!open) {
      reset();
      setFile(undefined);
      setImagePreview(undefined);
    }
  }, [user, open]);

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
    <FormUser
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: UpdateUserForm) => mutate(data))}
      control={control}
      type="update"
      isPending={isPending}
      imagePreview={imagePreview}
      onChangeImagePreview={onChangeImagePreview}
    />
  );
};

export default DialogUpdateUser;
