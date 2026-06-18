"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: string;
  control: Control<T>;
  placeholder: string;
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  control,
  placeholder,
}: FormInputProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={label}>{label}</FieldLabel>
            <Input
              {...field}
              id={label}
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default FormInput;
