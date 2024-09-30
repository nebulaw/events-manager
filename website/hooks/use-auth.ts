"use client";

import { useUser } from "./use-user";
import { axiosInstance as axios } from "@/lib/axios";
import type { AuthUserType, LoginType, RegisterType } from "@/types/auth";
import useLocalStorage from "./use-localstorage";

export const useAuth = () => {
  const { status, user, addUser, removeUser } = useUser();
  const { get } = useLocalStorage();

  const refresh = () => {
    let existingUser = get("user");
    if (existingUser) {
      try {
        addUser(JSON.parse(existingUser));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const register = async (creds: RegisterType) => {
    return await axios
      .post(`/sign-up/`, creds)
      .then((res) => res.data)
      .then((res) => {
        if (res.status === "success") {
          addUser(res.data);
        }
      })
  };

  const login = async (creds: LoginType) => {
    return await axios
      .post(`/sign-in/`, creds)
      .then((res) => res.data)
      .then((res) => {
        if (res.status === "success") {
          addUser(res.data);
        }
      });
  };

  const updateUser = (user: AuthUserType) => {
    removeUser();
    addUser(user);
  }

  const logout = () => { removeUser(); }

  return {
    status,
    user,
    login,
    register,
    updateUser,
    logout,
    refresh
  };
};
