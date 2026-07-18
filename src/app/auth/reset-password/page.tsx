import { Metadata } from "next";
import ResetPassword from "./_components/reset-password";

export const metadata: Metadata = {
    title: "Reset Password | POS",
    description: "Reset your password.",
};

export default function Page() {
    return <ResetPassword />
}