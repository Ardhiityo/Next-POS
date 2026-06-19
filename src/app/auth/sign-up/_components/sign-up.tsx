"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignUpForm, signUpFormSchema } from "@/validations/auth-validation";
import { INITIAL_SIGNUP_FORM } from "@/constants/auth-constant";
import { Field } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import { Loader2Icon } from "lucide-react";
import { signUpAction } from "../actions";
import { redirect } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function SignUp() {
  const { control, handleSubmit, reset, setError } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: INITIAL_SIGNUP_FORM,
  });
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    setIsPending(true);
    const { success, errors } = await signUpAction(data);
    setIsPending(false);
    if (success) {
      redirect("/auth/sign-in");
    } else if (typeof errors === "object") {
      Object.entries(errors).forEach(([field, messages]) => {
        setError(field as keyof SignUpForm, {
          message: messages?.[0],
        });
      });
    } else if (errors === "Internal Server Error") {
      toast.error(errors);
    } else {
      setError("email", { message: errors });
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
        <CardDescription>Sign up to getting started</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormInput
            name="name"
            label="Name"
            type="text"
            control={control}
            placeholder="Your name"
          />
          <FormInput
            name="email"
            label="Email"
            type="email"
            control={control}
            placeholder="Your email"
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            placeholder="Your password"
          />
          <FormInput
            name="passwordConfirmation"
            label="Password Confirmation"
            type="password"
            control={control}
            placeholder="Your password confirmation"
          />
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" form="sign-up" disabled={isPending}>
            {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
