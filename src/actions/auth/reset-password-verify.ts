"use server";

import { auth } from "@/lib/auth";
import { validationError } from "@/lib/utils";
import { ActionResponse } from "@/types/general";
import { ResetPasswordVerifyForm, resetPasswordVerifyFormSchema } from "@/validations/auth-validations";
import { APIError } from "better-auth";

type ResetPasswordParams = {
    form: ResetPasswordVerifyForm,
    token: string
}

export async function resetPasswordVerify(params: ResetPasswordParams): Promise<ActionResponse> {
    const { form, token } = params;

    const validated = resetPasswordVerifyFormSchema.safeParse(form);

    if (!validated.success) {
        return validationError(validated.error);
    }

    try {
        await auth.api.resetPassword({
            body: {
                newPassword: validated.data.password,
                token,
            },
        });
        return {
            success: true,
            data: null
        }
    } catch (error) {
        if (error instanceof APIError) {
            //console.log('APIError:', error.body?.message)
        } else if (error instanceof Error) {
            //console.log('APIError:', error.message)
        }
        return {
            success: false,
            error: {
                message: 'Failed update password'
            }
        }
    }
}