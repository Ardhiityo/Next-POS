import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "POS | Failed Reset Password",
    description: "Something wrong to reset your password.",
};

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-400">Failed Reset Password</h1>
                <section className="mt-2 flex flex-col gap-3">
                    <p>{"Something went wrong to reset your password"}</p>
                    <Button asChild>
                        <Link href="/auth/reset-password" className="font-semibold">Try again here</Link>
                    </Button>
                </section>
            </div>
        </main>
    );
}