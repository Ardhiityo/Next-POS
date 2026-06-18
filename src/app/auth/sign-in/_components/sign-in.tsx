"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInSchema, SignInForm } from "@/validations/auth-validation";
import { INITIAL_SIGNIN_FORM } from "@/constants/auth-constant";
import { Field } from "@/components/ui/field";
import FormInput from "@/components/common/form-input";

export default function SignIn() {
  const { control, handleSubmit, reset } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: INITIAL_SIGNIN_FORM,
  });

  function onSubmit(data: z.infer<typeof signInSchema>) {
    console.log(data);
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="sign-in"
          onSubmit={handleSubmit(onSubmit)}
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
          <Button type="submit" form="sign-in">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
