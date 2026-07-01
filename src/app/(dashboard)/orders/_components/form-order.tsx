"use client";

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
import {
  MENU_AVAILABILITIES,
  MENU_CATEGORIES,
} from "@/constants/menu-constants";
import { Loader2Icon } from "lucide-react";
import { BaseSyntheticEvent, SetStateAction } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type FormOrderProps<T extends FieldValues> = {
  type: "create" | "update";
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  onSubmit: (event: BaseSyntheticEvent) => void;
  isPending: boolean;
  control: Control<T>;
  imagePreview?: string;
  onChangeImagePreview: (image: File | undefined) => void;
};

const FormOrder = <T extends FieldValues>(props: FormOrderProps<T>) => {
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

  const title = type === "create" ? "Create order" : "Update order";
  const description =
    type === "create"
      ? "Make new order here. Click submit when you're done."
      : "Change order here. Click submit when you're done.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={onSubmit} id={`form-menu-${type}`}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 space-y-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <FormInput
              name={"name" as Path<T>}
              label="Name"
              type="text"
              control={control}
              placeholder="Name"
            />
            <FormSelect
              name={"category" as Path<T>}
              label="Category"
              control={control}
              items={MENU_CATEGORIES}
            />
            <FormInput
              name={"description" as Path<T>}
              label="Description"
              type="textarea"
              control={control}
              placeholder="description"
            />
            <FormInput
              name={"price" as Path<T>}
              label="Price"
              type="text"
              control={control}
              placeholder="Price"
            />
            <FormInput
              name={"discount" as Path<T>}
              label="Discount %"
              type="text"
              control={control}
              placeholder="Discount"
            />
            <FormImage
              name={"image" as Path<T>}
              label="Image"
              control={control}
              imagePreview={imagePreview}
              onChangeImagePreview={onChangeImagePreview}
            />
            <FormSelect
              name={"isAvailable" as Path<T>}
              label="Availability"
              control={control}
              items={MENU_AVAILABILITIES}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`form-menu-${type}`}
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

export default FormOrder;
