"use client";

import { resetPasswordVerify } from "@/actions/auth/reset-password-verify";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { INITIAL_RESET_PASSWORD_VERIFY_FORM } from "@/constants/auth-constant";
import { applyFieldErrors } from "@/lib/utils";
import { ResetPasswordVerifyForm, resetPasswordVerifyFormSchema } from "@/validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetPasswordVerify() {
    const params = useSearchParams();
    const router = useRouter();

    const { handleSubmit, control, reset, setError } = useForm({
        resolver: zodResolver(resetPasswordVerifyFormSchema),
        defaultValues: INITIAL_RESET_PASSWORD_VERIFY_FORM,
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['reset-password'],
        mutationFn: async (form: ResetPasswordVerifyForm) => {
            const token = params.get('token');
            if (!token) throw new Error('Failed updated password');
            const response = await resetPasswordVerify({ form, token });
            if (!response.success && response.error.fieldErrors) {
                applyFieldErrors(response.error.fieldErrors, setError)
            } else if (!response.success) {
                toast.error(response.error.message)
            } else if (response.success) {
                toast.success('Password updated successfully')
                router.push('/auth/sign-in');
            }
        },
    })

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
                <CardDescription>Enter your new password to update password</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="reset-password-verify"
                    onSubmit={handleSubmit((data) => mutate(data))}
                    className="space-y-4"
                >
                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        control={control}
                        placeholder="New Password"
                    />
                    <FormInput
                        name="passwordConfirmation"
                        label="Password Confirmation"
                        type="password"
                        control={control}
                        placeholder="New Password Confirmation"
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
                            <Button type="submit" form="reset-password-verify" disabled={isPending}>
                                {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
                            </Button>
                        </div>
                    </div>
                </Field>
            </CardFooter>
        </Card>
    )
}
