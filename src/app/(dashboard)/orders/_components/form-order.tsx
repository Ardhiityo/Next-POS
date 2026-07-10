"use client";

import { getAllTableAction } from "@/actions/table/get-all-table";
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
import { STATUS_ORDER_CREATE } from "@/constants/order-constants";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { BaseSyntheticEvent, SetStateAction, useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

type FormOrderProps<T extends FieldValues> = {
  type: "create" | "update";
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  onSubmit: (event: BaseSyntheticEvent) => void;
  isPending: boolean;
  control: Control<T>;
  typeOrder: "dine-in" | "takeaway";
};

const FormOrder = <T extends FieldValues>(props: FormOrderProps<T>) => {
  const { open, setOpen, onSubmit, isPending, control, type, typeOrder } =
    props;

  const title = type === "create" ? "Create order" : "Update order";

  const description =
    type === "create"
      ? "Make new order here. Click submit when you're done."
      : "Change order here. Click submit when you're done.";

  const { data: tables, error } = useQuery({
    queryKey: ["getAll-tables"],
    queryFn: async () => {
      return await getAllTableAction();
    },
    refetchOnMount: "always",
    enabled: typeOrder === "dine-in",
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={onSubmit} id={`form-order-${type}-${typeOrder}`}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 space-y-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <FormInput
              name={"customerName" as Path<T>}
              label="Customer name"
              type="text"
              control={control}
              placeholder="Customer name"
            />
            {typeOrder === "dine-in" && (
              <>
                <FormSelect
                  name={"tableId" as Path<T>}
                  label="Table"
                  control={control}
                  items={(tables?.data || []).map((table) => ({
                    value: table.id,
                    label: table.name,
                    disabled: table.status != "available",
                  }))}
                />
                <FormSelect
                  name={"status" as Path<T>}
                  label="Status"
                  control={control}
                  items={STATUS_ORDER_CREATE}
                />
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form={`form-order-${type}-${typeOrder}`}
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
