"use server";

import { auth } from "@/lib/auth";
import { validationError } from "@/lib/utils";
import { ActionResponse } from "@/types/general";
import { ResetPasswordForm, resetPasswordFormSchema } from "@/validations/auth-validations";
import { APIError } from "better-auth";

export async function resetPassword(form: ResetPasswordForm): Promise<ActionResponse> {
    const validated = resetPasswordFormSchema.safeParse(form);

    if (!validated.success) {
        return validationError(validated.error);
    }

    try {
        await auth.api.requestPasswordReset({
            body: {
                email: validated.data.email,
                redirectTo: "/auth/reset-password-verify",
            },
        });
        return {
            success: true,
            data: null
        }
    } catch (error) {
        if (error instanceof APIError) {
            // console.log('APIError:', error.body?.message)
        } else if (error instanceof Error) {
            //console.log('APIError:', error.message)
        }
        return {
            success: false,
            error: {
                message: 'Failed reset password'
            }
        }
    }

}