"use client";

import { signOutAction } from "@/actions/auth/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import {
  EllipsisVerticalIcon,
  Loader2Icon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import DialogUpdateProfile from "@/app/(dashboard)/admin/users/_components/dialog-update-profile";
import { UserContext } from "@/context/user-context";

export function NavUser() {
  const { isMobile } = useSidebar();
  const user = useContext(UserContext);
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const response = await signOutAction();
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Signed out successfully");
      }
      setOpen(false);
      push("/auth/sign-in");
    },
  });

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 grayscale">
                  <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                  <AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">
                    {user?.name}
                  </span>
                  <span className="truncate capitalize text-xs text-muted-foreground">
                    {user?.role?.toLowerCase()}
                  </span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                    <AvatarFallback>
                      {" "}
                      {user?.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium capitalize">
                      {user?.name}
                    </span>
                    <span className="truncate capitalize text-xs text-muted-foreground">
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                  <UserCircleIcon />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  mutate();
                }}
              >
                <LogOutIcon />
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Sign out"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogUpdateProfile
        open={openProfile}
        setOpen={setOpenProfile}
        user={user!}
      />
    </>
  );
}
