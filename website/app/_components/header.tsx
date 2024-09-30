"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function Header() {
  const { status, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md py-8 w-full flex justify-center">
      <div className="w-full px-20 flex justify-between items-center">
        {/* Company Logo */}
        <div className="text-4xl font-bold text-indigo-600 hover:cursor-pointer">
          <Link href="/" className="no-underline text-black hover:text-black">Events</Link>
        </div>

        {/* Sign In and Sign Up Buttons */}
        
        <div className="flex flex-row gap-4 items-center">
          <div>
            {status === "authenticated" && `Hello, ${user?.user.name}!`}
          </div>
          {status === "unauthenticated" ? (
            <Link
              href={"/authenticate"}
              className="btn no-underline"
            >
              Log in/Sign up
            </Link>
          ) : (
            <Link
              href={"/authenticate"}
              onClick={logout}
              className="btn no-underline"
            >
              Log out
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
