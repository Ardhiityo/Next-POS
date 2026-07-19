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
      <section className="flex flex-1 flex-col gap-7 p-5 min-w-0">
        <section className="flex gap-3 justify-between">
          <div className="flex gap-3 items-center">
            <SidebarTrigger />
            <DashboardBreadcrumb />
          </div>
          <DarkModeToggle />
        </section>
        <section>{children}</section>
      </section>
    </SidebarProvider>
  );
};

export default Layout;
