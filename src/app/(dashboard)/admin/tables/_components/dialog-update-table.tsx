"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { Table } from "@/generated/prisma/client";
import { applyFieldErrors } from "@/lib/utils";
import {
  UpdateTableForm,
  updateTableFormSchema,
} from "@/validations/table-validations";
import { updateTableAction } from "@/actions/table/update-table";
import FormTable from "./form-table";

type DialogUpdateTableProps = {
  table?: Table | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogUpdateTable = (props: DialogUpdateTableProps) => {
  const { table, open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setValue, setError } =
    useForm({
      resolver: zodResolver(updateTableFormSchema),
    });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-table"],
    mutationFn: async (form: UpdateTableForm) => {
      if (!table) throw new Error("Table not found");
      const response = await updateTableAction({
        table,
        form,
      });
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Table updated successfully");
        setOpen(false);
        refetch();
      }
      return response;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (table) {
      setValue("name", table.name);
      setValue("description", table?.description ?? "");
      setValue("capacity", table.capacity);
      setValue("status", table.status);
    }

    if (!open) {
      reset();
    }
  }, [table, open, setValue, reset]);

  return (
    <FormTable
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: UpdateTableForm) => mutate(data))}
      control={control}
      type="update"
      isPending={isPending}
    />
  );
};

export default DialogUpdateTable;
