import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type React from "react";

import { NavBar } from "@/components/navbar";
import { SideBar } from "@/components/sidebar";
import { authOptions } from "@/lib/auth";

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
      <div className="relative flex h-screen w-screen">
        <SideBar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <NavBar />
          <div className="max-h-[calc(100dvh_-h-16)] flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
