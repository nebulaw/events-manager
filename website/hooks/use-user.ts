import { useContext, useEffect } from "react";
import { AuthContext } from "@/app/_auth/auth-context";
import { AuthUserType, } from "@/types/auth";
import { setAuthToken } from "@/lib/axios";
import useLocalStorage from "@/hooks/use-localstorage";

export const useUser = () => {
  const { user, setUser, status, setStatus } = useContext(AuthContext);
  const { set, get, remove } = useLocalStorage();

  const addUser = (user: AuthUserType) => {
    setUser(user);
    set("user", user);
    setStatus("authenticated");
    setAuthToken(user.access_token);
  };

  const removeUser = () => {
    setUser(null);
    setStatus("unauthenticated");
    remove("user");
    setAuthToken();
  };

  useEffect(() => {
    if (user) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, [user, setUser])

  return {
    status,
    setStatus,
    user,
    setUser,
    addUser,
    removeUser,
  };
};
