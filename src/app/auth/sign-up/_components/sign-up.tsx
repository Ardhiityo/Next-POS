"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignUpForm, signUpFormSchema } from "@/validations/auth-validations";
import { INITIAL_SIGNUP_FORM } from "@/constants/auth-constant";
import { Field } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { signUpAction } from "@/actions/auth/sign-up";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { applyFieldErrors } from "@/lib/utils";

export default function SignUp() {
  const { control, handleSubmit, reset, setError } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: INITIAL_SIGNUP_FORM,
  });

  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (data: SignUpForm) => {
      const response = await signUpAction(data);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        push("/auth/sign-in");
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
        <CardDescription>Sign up to getting started</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up"
          onSubmit={handleSubmit((data) => mutate(data))}
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
