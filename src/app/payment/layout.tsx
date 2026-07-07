import { authIsRequired } from "@/lib/auth-utils";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  await authIsRequired();
  return (
    <section className="min-h-screen mx-auto flex justify-center items-center w-full">
      {children}
    </section>
  );
};

export default Layout;
