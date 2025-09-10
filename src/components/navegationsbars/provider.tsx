"use client";

import { FC, ReactNode } from "react";

import { NavBar } from "./navbar";
import { SideBar } from "./sidebar";

interface ProviderProps {
  children: ReactNode;
}

const NavigationProvider: FC<ProviderProps> = ({ children }) => {
  return (
    <div className="relative flex h-screen w-screen px-2 xl:gap-2">
      <SideBar />
      <div className="h-[100dvh] w-full overflow-x-hidden overflow-y-auto">
        <NavBar />
        {children}
      </div>
    </div>
  );
};

export default NavigationProvider;
