"use client";

import { UserContext } from "@/context/user-context";
import { User } from "@/types/user";
import { ReactNode } from "react";

type AuthStoreProviderProps = {
  children: ReactNode;
  user: User | null;
};

const AuthStoreProvider = ({ user, children }: AuthStoreProviderProps) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default AuthStoreProvider;
