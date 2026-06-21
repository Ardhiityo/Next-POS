import { EllipsisVerticalIcon, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Fragment, ReactNode } from "react";

type DropdownActionProps = {
  menus: {
    label: ReactNode;
    variant: "default" | "destructive";
    action: () => void;
    type: "button" | "link";
  }[];
};

const DropwdownAction = ({ menus }: DropdownActionProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="size-8">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {menus.map((menu, index) => (
            <Fragment key={`menu-${index}`}>
              <DropdownMenuItem
                variant={menu.variant}
                asChild={menu.type === "link"}
                onClick={menu.action}
              >
                {menu.label}
              </DropdownMenuItem>
              {menus.length - 1 !== index && <DropdownMenuSeparator />}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DropwdownAction;
