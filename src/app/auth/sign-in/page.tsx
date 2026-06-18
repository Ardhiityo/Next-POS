import { Metadata } from "next";
import SignIn from "./_components/sign-in";

export const metadata: Metadata = {
  title: "Sign In | POS",
  description: "Sign in to your account.",
};

export default function Page() {
  return <SignIn />;
}
