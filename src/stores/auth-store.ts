import { INITIAL_STATE_USER } from "@/constants/auth-constant";
import { UserWithRole } from "better-auth/plugins";
import { create } from "zustand";

type AuthState = {
  user: UserWithRole | null;
  setUser: (user: UserWithRole | null) => void;
  clearUser: () => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  user: INITIAL_STATE_USER as UserWithRole,
  setUser: (user: UserWithRole | null) => set(() => ({ user })),
  clearUser: () => set({ user: null }),
}));

export { useAuthStore };
