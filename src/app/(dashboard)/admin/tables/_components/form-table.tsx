"use client";

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
import { TABLE_STATUSES } from "@/constants/table-constants";
import { Loader2Icon } from "lucide-react";
import { BaseSyntheticEvent, SetStateAction } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type FormTableProps<T extends FieldValues> = {
  type: "create" | "update";
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  onSubmit: (event: BaseSyntheticEvent) => void;
  isPending: boolean;
  control: Control<T>;
};

const FormTable = <T extends FieldValues>(props: FormTableProps<T>) => {
  const { open, setOpen, onSubmit, isPending, control, type } = props;

  const title = type === "create" ? "Create table" : "Update table";
  const description =
    type === "create"
      ? "Make new table here. Click submit when you're done."
      : "Change table here. Click submit when you're done.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={onSubmit} id={`form-table-${type}`}>
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
            <FormInput
              name={"description" as Path<T>}
              label="Description"
              type="textarea"
              control={control}
              placeholder="description"
            />
            <FormInput
              name={"capacity" as Path<T>}
              label="Capacity"
              type="text"
              control={control}
              placeholder="capacity"
            />
            <FormSelect
              name={"status" as Path<T>}
              label="Status"
              control={control}
              items={TABLE_STATUSES}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`form-table-${type}`}
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

export default FormTable;
