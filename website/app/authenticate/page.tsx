"use client";

import React, {
    useState,
    useCallback,
} from "react";

import Login from "./_components/login";
import Register from "./_components/register";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
    const { status } = useAuth();

    const [isLoginPage, setIsLoginPage] = useState(true);
    const toggleCallback = useCallback(() => {
        setIsLoginPage(!isLoginPage);
    }, [isLoginPage])

    if (status === "authenticated") {
        redirect("/");
    }
    
    return (
        <div className="h-full flex justify-center items-center">
            {isLoginPage ?
                <Login toggleCallback={toggleCallback} /> :
                <Register toggleCallback={toggleCallback} />}
        </div>
    )
}
