import { INITIAL_CREATE_USER_FORM } from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserFormSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import FormUser from "./form-user";
import { createUserAction } from "@/actions/user/create-user";

type DialogCreateUserProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogCreateUser = (props: DialogCreateUserProps) => {
  const { open, setOpen, refetch } = props;

  const { control, handleSubmit, reset } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: createUserAction,
    onSuccess: () => {
      toast.success("User created successfully");
      refetch();
      setOpen(false);
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
    <FormUser
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: CreateUserForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
      onChangeImagePreview={onChangeImagePreview}
      imagePreview={imagePreview}
    />
  );
};

export default DialogCreateUser;
