"use client";

import { useAuthStore } from "@/stores/auth-store";
import { AuthUser } from "@/types/auth";
import React from "react";

type AuthStoreProviderProps = {
  children: React.ReactNode;
  user: AuthUser;
};

const AuthStoreProvider = ({ children, user }: AuthStoreProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  setUser(user);
  return <>{children}</>;
};

export default AuthStoreProvider;
