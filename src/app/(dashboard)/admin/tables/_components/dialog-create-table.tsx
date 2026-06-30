"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect, useState } from "react";
import FormMenu from "./form-table";
import { applyFieldErrors } from "@/lib/utils";
import {
  CreateTableForm,
  createTableFormSchema,
} from "@/validations/table-validations";
import { INITIAL_CREATE_TABLE_FORM } from "@/constants/table-constants";
import { createTableAction } from "@/actions/table/create-table";

type DialogCreateTableProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogCreateTable = (props: DialogCreateTableProps) => {
  const { open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setError } = useForm({
    resolver: zodResolver(createTableFormSchema),
    defaultValues: INITIAL_CREATE_TABLE_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-table"],
    mutationFn: async (form: CreateTableForm) => {
      const response = await createTableAction(form);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Table created successfully");
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
    if (!open) {
      reset();
    }
  }, [open]);

  return (
    <FormMenu
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: CreateTableForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
    />
  );
};

export default DialogCreateTable;
