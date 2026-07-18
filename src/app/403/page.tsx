import { Metadata } from "next";

export const metadata: Metadata = {
    title: "POS | Forbidden",
    description: "Don't have permission.",
};

export default function Page() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">403</h1>
                <p>{"You don't have permission to access this page."}</p>
            </div>
        </main>
    );
}