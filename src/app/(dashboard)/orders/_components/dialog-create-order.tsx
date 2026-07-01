"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { applyFieldErrors } from "@/lib/utils";
import { INITIAL_CREATE_ORDER_FORM } from "@/constants/order-constants";
import {
  CreateOrderForm,
  createOrderFormSchema,
} from "@/validations/order-validations";
import { createOrderAction } from "@/actions/order/create-order";
import FormOrder from "./form-order";

type DialogCreateOrderProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogCreateOrder = (props: DialogCreateOrderProps) => {
  const { open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setError } = useForm({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: INITIAL_CREATE_ORDER_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async (form: CreateOrderForm) => {
      const response = await createOrderAction(form);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Order created successfully");
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
    <FormOrder
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: CreateOrderForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
    />
  );
};

export default DialogCreateOrder;
