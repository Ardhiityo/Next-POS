"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={(resolvedTheme ?? "system") as "light" | "dark" | "system"}
    />
  );
}
