import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type React from "react";

import NavigationProvider from "@/components/navegationsbars/Provider";
import { Toaster } from "@/components/ui/sonner";
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
      <NavigationProvider>{children}</NavigationProvider>
      <Toaster />
    </div>
  );
}
