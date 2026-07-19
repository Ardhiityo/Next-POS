"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import DialogDelete from "@/components/common/dialog-delete";
import { DeleteTableForm } from "@/validations/table-validations";
import { deleteTable } from "@/actions/table/delete-table";
import { Table } from "@/generated/prisma/client";

type DialogDeleteTableProps = {
  table?: Table | null;
  refetch: () => void;
  open: boolean;
  setOpen: (event: SetStateAction<boolean>) => void;
};

const DialogDeleteTable = (props: DialogDeleteTableProps) => {
  const { table, open, setOpen, refetch } = props;

  const { handleSubmit, setValue } = useForm<DeleteTableForm>();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-table"],
    mutationFn: async (form: DeleteTableForm) => {
      if (!form) throw new Error("Table not found");
      const response = await deleteTable(form);
      if (!response.success) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Table deleted successfully");
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
      setValue("tableId", table.id);
    }
  }, [table, setValue]);

  return (
    <DialogDelete
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data: DeleteTableForm) => mutate(data))}
      title="Table"
      isPending={isPending}
    />
  );
};

export default DialogDeleteTable;
