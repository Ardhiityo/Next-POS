"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_MENU_LIST } from "@/constants/sidebar-constant";
import { Role } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMenu() {
  const path = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {SIDEBAR_MENU_LIST[user?.role as Role]?.map((item) => (
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
