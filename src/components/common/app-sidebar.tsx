"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CoffeeIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { NavMenu } from "./nav-menu";
import { User } from "better-auth";
import { SIDEBAR_MENU_LIST } from "@/constants/sidebar-constant";

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <CoffeeIcon className="size-5!" />
                <span className="text-base font-semibold">Cafeku.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={SIDEBAR_MENU_LIST.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
