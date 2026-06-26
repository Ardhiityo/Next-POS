import FormInput from "@/components/common/form-input";
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
import { INITIAL_CREATE_USER_FORM, ROLE_LIST } from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserFormSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import FormSelect from "@/components/common/form-select";
import FormImage from "@/components/common/form-image";
import { uploadFileAction } from "@/actions/storage/upload-file";
import { deleteFileAction } from "@/actions/storage/delete-file";

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
      const {
        publicUrl,
        filePath,
        error: errorUpload,
      } = await uploadFileAction("images", "users", createUserForm.image);

      if (errorUpload) {
        throw new Error(errorUpload);
      }

      const { error } = await authClient.admin.createUser({
        name: createUserForm.name,
        email: createUserForm.email,
        role: createUserForm.role,
        password: createUserForm.password,
        data: {
          image: publicUrl,
        },
      });

      if (error) {
        const { error: errorDelete } = await deleteFileAction(
          "images",
          filePath,
        );
        if (errorDelete) {
          throw new Error(errorDelete);
        }
        throw new Error(error.message);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        id="create-user-form"
      >
        <DialogTrigger asChild>
          <Button variant="outline">Create</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Make new user here. Click submit when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FormInput
            name="name"
            label="Name"
            type="name"
            control={control}
            placeholder="Name"
          />
          <FormInput
            name="email"
            label="Email"
            type="email"
            control={control}
            placeholder="Email"
          />
          <FormSelect
            name="role"
            label="Role"
            control={control}
            items={ROLE_LIST}
          />
          <FormImage name="image" label="Image" control={control} />
          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            placeholder="Password"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="create-user-form" disabled={isPending}>
              {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DialogCreateUser;
