import { User } from "@/types/user";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);