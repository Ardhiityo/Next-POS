"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { signInFormSchema, SignInForm } from "@/validations/auth-validations";
import { INITIAL_SIGNIN_FORM } from "@/constants/auth-constant";
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
import { signInAction } from "@/actions/auth/sign-in";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { applyFieldErrors } from "@/lib/utils";

export default function SignIn() {
  const { push } = useRouter();

  const { control, handleSubmit, reset, setError } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: INITIAL_SIGNIN_FORM,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data: SignInForm) => {
      const response = await signInAction(data);
      if (!response.success && response.error.fieldErrors) {
        applyFieldErrors(response.error.fieldErrors, setError);
      } else if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        push("/");
      }
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
        <CardDescription>Sign in to access all features</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-in"
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-4"
        >
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
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" form="sign-in" disabled={isPending}>
            {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
