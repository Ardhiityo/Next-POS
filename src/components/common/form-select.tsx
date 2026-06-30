"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Role } from "@/generated/prisma/enums";

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  disabled?: boolean;
  control: Control<T>;
  items: { label: string; value: Role | string }[];
};

const FormSelect = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  control,
  items,
}: FormSelectProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={label}>{label}</FieldLabel>
            <Select
              disabled={disabled}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder={`Select a ${label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {items.map((item, index) => (
                    <SelectItem
                      key={`select-item-${index}-${item.value}-${item.label}`}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default FormSelect;
