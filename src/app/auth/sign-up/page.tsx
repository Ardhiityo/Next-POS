import { Metadata } from "next";
import SignUp from "./_components/sign-up";

export const metadata: Metadata = {
  title: "Sign Up | POS",
  description: "Sign up to your account.",
};

export default function Page() {
  return <SignUp />;
}
