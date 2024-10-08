"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import type { AuthUserType } from "@/types/auth";
import useLocalStorage from "@/hooks/use-localstorage";

interface AuthContextType {
  user: AuthUserType | null;
  setUser: Dispatch<SetStateAction<AuthUserType | null>>;
  status: "authenticated" | "unauthenticated";
  setStatus: Dispatch<SetStateAction<"authenticated" | "unauthenticated">>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  status: "unauthenticated",
  setStatus: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const { get } = useLocalStorage();
  const [user, setUser] = useState<AuthUserType | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated">(
    "unauthenticated"
  );

  useEffect(() => {
    if (!user) {
      let existingUser = get("user");
      if (existingUser) {
        try {
          setUser(JSON.parse(existingUser))
          setStatus("authenticated");
        } catch (e) {
          setStatus("unauthenticated");
        }
      } else {
        setStatus("unauthenticated");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, status, setStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
