import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/ui/darkmode-toggle";

export default function Page() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
      <DarkModeToggle />
    </div>
  );
}
