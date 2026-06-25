import { DarkModeToggle } from "@/components/ui/darkmode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";
import { AppSidebar } from "@/components/common/app-sidebar";
import React from "react";
import { authIsRequired } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await authIsRequired();
  return (
    <SidebarProvider>
      <AppSidebar />
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
