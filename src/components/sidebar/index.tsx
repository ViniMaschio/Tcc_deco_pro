"use client";

import { IconButton } from "@radix-ui/themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { IoLogOutOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";

import { useSidebarStore } from "@/store/sidebar";

import { menuItems } from "./menu";

export const SideBar = () => {
  const [open] = useSidebarStore(useShallow((state) => [state.open]));

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  return (
    <div
      className={`m-2 hidden rounded-md bg-white transition-all duration-350 xl:block ${
        open ? "w-50" : "w-16"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image src="/static/images/logo_collapse.png" alt="DecoPro" width={32} height={32} />
            {open && <span className="text-xl font-bold text-gray-800">DecoPro</span>}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {open ? (
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
                ) : (
                  <button
                    onClick={() => handleNavigation(item?.path || "")}
                    className={twMerge(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      item.pathnames.includes(pathname)
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {item.icon}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="w-full p-3">
          <IconButton onClick={handleLogout} variant="ghost" color={"gray"}>
            <div className="flex w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-500 hover:bg-gray-200">
              <IoLogOutOutline size={20} />
              <span className={open ? "block" : "hidden"}>Sair</span>
            </div>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
