"use client";

import { useUser } from "@/hooks/use-user";
import Header from "./_components/header";
import Loading from "./loading";
import Feed from "./_components/feed";

export default function Home() {
  const { status, user } = useUser();

  return (
    <div>
      <Header />
      <div className="grid grid-rows-2 items-center w-full h-full mt-32 p-3 pb-20 gap-20 sm:p-20]">
        <div className="flex flex-col items-center px-20">
          <Feed />
        </div>
      </div>
    </div>
  );
}
