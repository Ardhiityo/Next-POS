"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";

type ActionLabelProps = {
  type: "edit" | "delete";
};

const ActionLabel = (props: ActionLabelProps) => {
  return (
    <div className="flex gap-1 items-center">
      {props.type === "edit" ? <PencilIcon /> : <Trash2Icon />}
      {props.type === 'edit' ? 'Edit' : 'Delete'}
    </div>
  );
};

export default ActionLabel;
