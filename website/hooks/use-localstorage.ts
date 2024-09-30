"use client";

import { useEffect, useState } from "react";

const useLocalStorage = () => {
    const store = typeof window !== "undefined" ? localStorage : null;
    const get = (key: string | null) => {
        if (key) {
            try {
                return store?.getItem(key)
            } catch (err) {
                return null;
            }
        }
        return null;
    };
    const set = (key: string, value: any) => {
        store?.setItem(key, JSON.stringify(value));
    }
    const remove = (key: string) => store?.setItem(key, "");
    return { get, set, remove };
};

export default useLocalStorage;
