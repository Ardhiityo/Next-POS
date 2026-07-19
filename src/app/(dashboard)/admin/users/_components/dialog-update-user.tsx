"use client";

import {
  UpdateUserForm,
  updateUserFormSchema,
} from "@/validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import FormUser from "./form-user";
import { updateUserAction } from "@/actions/user/update-user";
import { Role } from "@/generated/prisma/enums";
import { applyFieldErrors } from "@/lib/utils";
import type { UserWithRole } from "better-auth/plugins";

type DialogUpdateUserProps = {
  user?: UserWithRole | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogUpdateUser = (props: DialogUpdateUserProps) => {
  const { user, open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setValue, setError } =
    useForm<UpdateUserForm>({
      resolver: zodResolver(updateUserFormSchema),
    });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (form: UpdateUserForm) => {
      if (!user) throw new Error("User not found");
      const response = await updateUserAction({
        user,
        form,
      });
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("User created successfully");
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
  }, [user, open, reset, setValue]);

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
