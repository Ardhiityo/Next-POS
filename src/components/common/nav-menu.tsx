"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  SIDEBAR_MENU_LIST,
  SIDEBAR_MENU_LIST_KEY,
} from "@/constants/sidebar-constant";
import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export function NavMenu() {
  const path = usePathname();
  const user = useContext(UserContext);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {SIDEBAR_MENU_LIST[user?.role as SIDEBAR_MENU_LIST_KEY]?.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={cn(
                "py-6 my-1",
                path === item.url &&
                "bg-slate-500 text-white font-semibold  hover:bg-slate-500 hover:text-white hover:font-semibold",
              )}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
