import { ActionResponse } from "@/types/general";
import { clsx, type ClassValue } from "clsx";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { flattenError, ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function priceToIDR(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function validationError(error: ZodError): ActionResponse {
  return {
    success: false,
    error: {
      message: "Validation Error",
      fieldErrors: flattenError(error).fieldErrors,
    },
  };
}

export function applyFieldErrors<T extends FieldValues>(
  errors: Record<string, string[]>,
  setError: UseFormSetError<T>,
) {
  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      message: messages[0],
    });
  });
}
