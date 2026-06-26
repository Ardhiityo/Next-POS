import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
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
import { ROLE_LIST } from "@/constants/auth-constant";
import { CreateUserForm } from "@/validations/auth-validation";
import { Loader2Icon } from "lucide-react";
import { SetStateAction } from "react";
import { Control, FieldValues } from "react-hook-form";

type FormUserProps = {
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  onSubmit: () => void;
  isPending: boolean;
  control: Control<CreateUserForm>;
  type: "create" | "update";
};

const FormUser = (props: FormUserProps) => {
  const { open, setOpen, onSubmit, isPending, control } = props;

  const title = props.type === "create" ? "Create user" : "Update user";
  const description =
    props.type === "create"
      ? "Make new user here. Click submit when you're done."
      : "Change user here. Click submit when you're done.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={onSubmit} id="create-user-form">
        <DialogTrigger asChild>
          <Button variant="outline">Create</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
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

export default FormUser;
