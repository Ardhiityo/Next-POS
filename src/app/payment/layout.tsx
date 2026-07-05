import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="min-h-screen mx-auto flex justify-center items-center w-full">
      {children}
    </section>
  );
};

export default Layout;
