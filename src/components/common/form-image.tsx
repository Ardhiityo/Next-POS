"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SetStateAction, useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

type FormImageProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  imagePreview?: string;
  setImagePreview?: (image: SetStateAction<string | undefined>) => void;
  onChangeImagePreview: (image: File | undefined) => void;
};

const FormImage = <T extends FieldValues>({
  name,
  label,
  control,
  imagePreview,
  onChangeImagePreview,
}: FormImageProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={label}>{label}</FieldLabel>
            <div className="flex gap-2 items-center">
              <Avatar className="size-10">
                <AvatarImage src={imagePreview} alt="preview" />
                <AvatarFallback>
                  <ImageIcon />
                </AvatarFallback>
              </Avatar>
              <Input
                ref={field.ref}
                name={field.name}
                type="file"
                accept="image/*"
                onBlur={field.onBlur}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                  onChangeImagePreview(file);
                }}
                aria-invalid={fieldState.invalid}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default FormImage;
