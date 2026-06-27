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
} from "@/components/ui/dialog";
import { ROLE_LIST } from "@/constants/auth-constant";
import { Loader2Icon } from "lucide-react";
import { SetStateAction } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type FormUserProps<T extends FieldValues> = {
  type: "create" | "update";
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  onSubmit: () => void;
  isPending: boolean;
  control: Control<T>;
  imagePreview?: string;
  onChangeImagePreview: (image: File | undefined) => void;
};

const FormUser = <T extends FieldValues>(props: FormUserProps<T>) => {
  const {
    open,
    setOpen,
    onSubmit,
    isPending,
    control,
    type,
    imagePreview,
    onChangeImagePreview,
  } = props;

  const title = props.type === "create" ? "Create user" : "Update user";
  const description =
    props.type === "create"
      ? "Make new user here. Click submit when you're done."
      : "Change user here. Click submit when you're done.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={onSubmit} id={`form-${type}-user`}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FormInput
            name={"name" as Path<T>}
            label="Name"
            type="name"
            control={control}
            placeholder="Name"
          />
          {type === "create" && (
            <FormInput
              name={"email" as Path<T>}
              label="Email"
              type="email"
              control={control}
              placeholder="Email"
            />
          )}
          <FormSelect
            name={"role" as Path<T>}
            label="Role"
            control={control}
            items={ROLE_LIST}
          />
          <FormImage
            name={"image" as Path<T>}
            label="Image"
            control={control}
            imagePreview={imagePreview}
            onChangeImagePreview={onChangeImagePreview}
          />
          {type === "create" && (
            <FormInput
              name={"password" as Path<T>}
              label="Password"
              type="password"
              control={control}
              placeholder="Password"
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`form-${type}-user`}
              disabled={isPending}
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default FormUser;
