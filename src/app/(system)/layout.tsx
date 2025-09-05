"use client";

import type React from "react";

import { NavBar } from "./navegationbars/navbar";
import { SideBar } from "./navegationbars/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-[#F1F5F9] text-black">
      <div className="relative flex h-screen w-screen px-2 xl:gap-2">
        <SideBar />
        <div className="h-[100dvh] w-full overflow-x-hidden overflow-y-auto">
          <NavBar />
          {children}
        </div>
      </div>
    </div>
  );
}
