import {
  LayoutDashboardIcon,
  ListOrderedIcon,
  MenuIcon,
  Table2Icon,
  UserIcon,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  ADMIN: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Order",
      url: "/orders",
      icon: ListOrderedIcon,
    },
    {
      title: "Menu",
      url: "/admin/menus",
      icon: MenuIcon,
    },
    {
      title: "Table",
      url: "/admin/tables",
      icon: Table2Icon,
    },
    {
      title: "User",
      url: "/admin/users",
      icon: UserIcon,
    },
  ],
  CASHIER: [
    {
      title: "Order",
      url: "/orders",
      icon: ListOrderedIcon,
    },
  ],
};

export type SIDEBAR_MENU_LIST_KEY = keyof typeof SIDEBAR_MENU_LIST;
