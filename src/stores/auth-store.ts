import { INITIAL_STATE_USER } from "@/constants/auth-constant";
import { AuthUser } from "@/types/auth";
import { create } from "zustand";

type State = {
  user: AuthUser;
};

type Action = {
  setUser: (user: AuthUser) => void;
};

const useAuthStore = create<State & Action>()((set) => ({
  user: INITIAL_STATE_USER as AuthUser,
  setUser: (user) => set(() => ({ user })),
}));

export { useAuthStore };
