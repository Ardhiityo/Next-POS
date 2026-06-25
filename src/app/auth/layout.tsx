import { DarkModeToggle } from "@/components/ui/darkmode-toggle";
import { authIsRequired } from "@/lib/auth-utils";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = async function Layout({ children }: LayoutProps) {
  return (
    <>
      <section className="relative w-full min-h-screen flex flex-col mx-auto justify-center items-center">
        <header className="absolute right-4 top-4">
          <DarkModeToggle />
        </header>
        {children}
      </section>
    </>
  );
};

export default Layout;
