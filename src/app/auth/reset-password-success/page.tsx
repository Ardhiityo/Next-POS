import { Metadata } from "next";

export const metadata: Metadata = {
    title: "POS | Success Reset Password",
    description: "Success to reset your password.",
};

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-400">Verification link sent successfully</h1>
                <section className="mt-2 flex flex-col gap-3">
                    <p>{"Please check your email to continue reset your password on your account"}</p>
                </section>
            </div>
        </main>
    );
}