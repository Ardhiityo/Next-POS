"use client";

import { useAuthStore } from "@/stores/auth-store";
import { UserWithRole } from "better-auth/plugins";
import React, { useEffect } from "react";

type AuthStoreProviderProps = {
  children: React.ReactNode;
  user: UserWithRole | null;
};

const AuthStoreProvider = ({ user, children }: AuthStoreProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
};

export default AuthStoreProvider;
