import {
  LayoutDashboardIcon,
  ListOrderedIcon,
  MenuIcon,
  Table2Icon,
  UserIcon,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Order",
      url: "/order",
      icon: ListOrderedIcon,
    },
    {
      title: "Menu",
      url: "/admin/menu",
      icon: MenuIcon,
    },
    {
      title: "Table",
      url: "/admin/table",
      icon: Table2Icon,
    },
    {
      title: "User",
      url: "/admin/user",
      icon: UserIcon,
    },
  ],
};
