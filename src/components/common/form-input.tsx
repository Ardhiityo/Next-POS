"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "password" | "textarea";
  control: Control<T>;
  placeholder?: string;
  disabled?: boolean
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  type = "text",
  control,
  placeholder,
  disabled = false
}: FormInputProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={label}>{label}</FieldLabel>
            {type === "text" || type === "email" || type === "password" ? (
              <Input
                {...field}
                id={label}
                type={type}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                autoComplete="off"
                disabled={disabled}
              />
            ) : (
              <Textarea
                {...field}
                id={label}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                className="resize-none"
              />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default FormInput;
