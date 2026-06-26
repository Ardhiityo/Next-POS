import { INITIAL_CREATE_USER_FORM } from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserFormSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import FormUser from "./form-user";
import { createUserAction } from "@/actions/user/create-user";

const DialogCreateUser = ({ refetch }: { refetch: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open]);

  const { control, handleSubmit, reset } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (createUserForm: CreateUserForm) => {
      const { error } = await createUserAction(createUserForm);
      if (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("User created successfully");
      refetch();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data: CreateUserForm) => {
    mutate(data);
  });

  return (
    <FormUser
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
      control={control}
      type="create"
      isPending={isPending}
    />
  );
};

export default DialogCreateUser;
