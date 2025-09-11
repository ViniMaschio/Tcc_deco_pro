"use client";

import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <Theme>
      <SessionProvider>{children}</SessionProvider>
    </Theme>
  );
};

export default Provider;
