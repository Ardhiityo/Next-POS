"use client";

import { UserContext } from "@/context/user-context";
import { User } from "@/types/user";
import { ReactNode, useState } from "react";

type AuthStoreProviderProps = {
  children: ReactNode;
  user: User | null;
};

const AuthStoreProvider = ({ user, children }: AuthStoreProviderProps) => {
  const [currentUser, setCurrentUser] = useState(user);
  return <UserContext.Provider value={{
    user: currentUser, setUser: setCurrentUser
  }}>
    {children}
  </UserContext.Provider>;
};

export default AuthStoreProvider;
