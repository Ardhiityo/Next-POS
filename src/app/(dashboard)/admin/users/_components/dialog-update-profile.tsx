import { updateProfile } from "@/actions/user/update-profile";
import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
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
import { User } from "@/types/user";
import {
  ProfileForm,
  profileFormSchema,
} from "@/validations/profile-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: User | null;
};

const DialogUpdateProfile = (props: Props) => {
  const { open, setOpen, user } = props;

  const { control, reset, setValue, handleSubmit } = useForm({
    resolver: zodResolver(profileFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile", user?.id],
    mutationFn: async (data: ProfileForm) => {
      if (!user) throw new Error("User not found");
      const response = await updateProfile({ user, form: data });
      if (!response.success) {
        toast.error(response.error.message);
      }
      if (response.success) {
        toast.success("Update profile successfully");
        setOpen(false);
      }
      return response;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  const onChangeImagePreview = (image: File | undefined) => {
    setFile(image);
  };

  useEffect(() => {
    if (!open) {
      reset();
      setFile(undefined);
      setImagePreview(undefined);
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, open]);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("image", user.image ?? "");
      setImagePreview(user?.image ?? undefined);
    }
  }, [user, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="update-profile" onSubmit={handleSubmit((data) => mutate(data))}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FormInput
            label="Name"
            control={control}
            name="name"
            placeholder="name"
          />
          <FormImage
            label="Avatar"
            control={control}
            name="image"
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            onChangeImagePreview={onChangeImagePreview}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="update-profile" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DialogUpdateProfile;
