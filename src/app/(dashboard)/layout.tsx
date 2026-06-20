import { DarkModeToggle } from "@/components/ui/darkmode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";
import { AppSidebar } from "@/components/common/app-sidebar";
import { authIsRequired } from "@/lib/auth-utils";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await authIsRequired();
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main className="flex flex-1 flex-col gap-7 p-5">
        <header className="flex flex-col gap-7">
          <section className="flex justify-between">
            <SidebarTrigger />
            <DarkModeToggle />
          </section>
          <DashboardBreadcrumb />
        </header>
        <section>{children}</section>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
