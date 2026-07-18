import { Metadata } from "next";
import { ResetPasswordVerify } from "./_components/reset-password-verify";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Reset Password Verify | POS",
    description: "Verify Your Reset password Link.",
};

type PageProps = {
    searchParams: Promise<{ token: string, error: string }>
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;

    if (params.error) {
        redirect('/auth/reset-password-failed');
    }

    return <ResetPasswordVerify />
}