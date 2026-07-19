"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { applyFieldErrors } from "@/lib/utils";
import { INITIAL_CREATE_ORDER_DINE_IN_FORM } from "@/constants/order-constants";
import { createOrderDineIn } from "@/actions/order/create-order-dine-in";
import FormOrder from "./form-order";
import {
  CreateOrderDineInForm,
  createOrderDineInFormSchema,
} from "@/validations/order-validations";

type DialogCreateOrderDineInProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
  table?: {
    id: string,
    name: string
  } | null
};

const DialogCreateOrderDineIn = (props: DialogCreateOrderDineInProps) => {
  const { open, setOpen, refetch, table } = props;

  const { control, handleSubmit, reset, setError, setValue } = useForm({
    resolver: zodResolver(createOrderDineInFormSchema),
    defaultValues: INITIAL_CREATE_ORDER_DINE_IN_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-order-dine-in"],
    mutationFn: async (form: CreateOrderDineInForm) => {
      const response = await createOrderDineIn(form);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Order created successfully");
        refetch();
      }
      return response;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  useEffect(() => {
    if (table) {
      setValue('tableId', table.id)
    }
  }, [table, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <FormOrder
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: CreateOrderDineInForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
      typeOrder="dine-in"
      selectedTable={table?.name ?? null}
    />
  );
};

export default DialogCreateOrderDineIn;
