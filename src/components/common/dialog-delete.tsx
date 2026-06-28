import { Loader2Icon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type DialogDeleteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  onSubmit: () => void;
  isPending: boolean;
};

const DialogDelete = (props: DialogDeleteProps) => {
  const { open, setOpen, title, onSubmit, isPending } = props;
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <form id="form-delete" onSubmit={onSubmit}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {title.toLocaleLowerCase()}{" "}
              conversation
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <Button type="submit" form="form-delete" variant="destructive">
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                `Delete ${title.toLocaleLowerCase()}`
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default DialogDelete;
