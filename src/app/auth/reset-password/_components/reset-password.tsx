"use client";

import { resetPassword } from "@/actions/auth/reset-password";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { INITIAL_RESET_PASSWORD_FORM } from "@/constants/auth-constant";
import { applyFieldErrors } from "@/lib/utils";
import { ResetPasswordForm, resetPasswordFormSchema } from "@/validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPassword() {
    const router = useRouter();

    const { handleSubmit, control, reset, setError } = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: INITIAL_RESET_PASSWORD_FORM,
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['reset-password'],
        mutationFn: async (form: ResetPasswordForm) => {
            const response = await resetPassword(form);
            if (!response.success && response.error.fieldErrors) {
                applyFieldErrors(response.error.fieldErrors, setError);
            } else if (!response.success) {
                toast.error(response.error.message);
            } else if (response.success) {
                router.push('/auth/reset-password-success');
            }
        }
    })

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
                <CardDescription>Enter your email to got a link reset password verification.</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="reset-password"
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
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <div className="flex justify-between w-full flex-wrap">
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => reset()}>
                                Reset
                            </Button>
                            <Button type="submit" form="reset-password" disabled={isPending}>
                                {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
                            </Button>
                        </div>
                    </div>
                </Field>
            </CardFooter>
        </Card>
    )
}
