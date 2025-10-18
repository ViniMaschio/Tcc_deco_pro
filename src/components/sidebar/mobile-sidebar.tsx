"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { IconButton } from "@radix-ui/themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";

import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebarStore } from "@/store/sidebar";

import { menuItems } from "./menu";

export const MobileSidebar = () => {
  const [open, setOpen] = useSidebarStore(useShallow((state) => [state.open, state.setOpen]));
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false); // Fechar sidebar após navegação
  };

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  // Não renderizar em desktop
  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <SheetPrimitive.Content className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col gap-4 border-r p-0 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500">
          <SheetHeader className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
            <SheetTitle className="flex items-center gap-2">
              <Image src="/static/images/logo_collapse.png" alt="DecoPro" width={32} height={32} />
              <span className="text-xl font-bold text-gray-800">DecoPro</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item?.path || "")}
                    className={twMerge(
                      "flex h-[40px] w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      item.pathnames.includes(pathname)
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full p-3">
            <IconButton onClick={handleLogout} variant="ghost" color={"gray"}>
              <div className="flex w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-500 hover:bg-gray-200">
                <IoLogOutOutline size={20} />
                <span>Sair</span>
              </div>
            </IconButton>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </Sheet>
  );
};
