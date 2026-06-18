import { DarkModeToggle } from "@/components/ui/darkmode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="relative container min-h-screen flex flex-col mx-auto justify-center items-center">
        <header className="absolute right-4 top-4">
          <DarkModeToggle />
        </header>
        {children}
      </section>
    </>
  );
}
