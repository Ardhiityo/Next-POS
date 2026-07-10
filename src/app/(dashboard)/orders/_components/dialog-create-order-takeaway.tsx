"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { applyFieldErrors } from "@/lib/utils";
import { INITIAL_CREATE_ORDER_TAKEAWAY_FORM } from "@/constants/order-constants";
import {
  CreateOrderTakeawayForm,
  createOrderTakeawayFormSchema,
} from "@/validations/order-validations";
import FormOrder from "./form-order";
import { createOrderTakeaway } from "@/actions/order/create-order-takeaway";

type DialogCreateOrderTakeawayProps = {
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogCreateOrderTakeaway = (props: DialogCreateOrderTakeawayProps) => {
  const { open, setOpen, refetch } = props;

  const { control, handleSubmit, reset, setError } = useForm({
    resolver: zodResolver(createOrderTakeawayFormSchema),
    defaultValues: INITIAL_CREATE_ORDER_TAKEAWAY_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-order-takeaway"],
    mutationFn: async (form: CreateOrderTakeawayForm) => {
      const response = await createOrderTakeaway(form);
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
      onSubmit={handleSubmit((data: CreateOrderTakeawayForm) => mutate(data))}
      control={control}
      type="create"
      isPending={isPending}
      typeOrder="takeaway"
    />
  );
};

export default DialogCreateOrderTakeaway;
