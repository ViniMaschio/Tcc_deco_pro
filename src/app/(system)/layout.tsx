import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type React from "react";

import { Toaster } from "@/components/ui/sonner";
import { authOptions } from "@/lib/auth";

import { NavBar } from "./navegationbars/navbar";
import { SideBar } from "./navegationbars/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-[#F1F5F9] text-black">
      <div className="relative flex h-screen w-screen px-2 xl:gap-2">
        <SideBar />
        <div className="h-[100dvh] w-full overflow-x-hidden overflow-y-auto">
          <NavBar />
          {children}
          <Toaster />
        </div>
      </div>
    </div>
  );
}
