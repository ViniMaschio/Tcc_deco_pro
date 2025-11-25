"use client";

import { IconButton } from "@radix-ui/themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { IoLogOutOutline } from "react-icons/io5";
import { ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
          <TooltipProvider delayDuration={0}>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  item.pathnames.includes(pathname) ||
                  (hasChildren &&
                    item.children?.some((child) => child.pathnames.includes(pathname)));

                if (hasChildren && open) {
                  return (
                    <li key={item.id}>
                      <Collapsible className="group/collapsible">
                        <CollapsibleTrigger asChild>
                          <button
                            className={twMerge(
                              "flex h-[40px] w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            {item.icon}
                            <span className="flex-1 text-left">{item.label}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="mt-1 space-y-1 pl-4">
                            {item.children?.map((child) => (
                              <li key={child.id}>
                                <button
                                  onClick={() => handleNavigation(child.path)}
                                  className={twMerge(
                                    "flex h-[36px] w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    child.pathnames.includes(pathname)
                                      ? "bg-primary/80 hover:bg-primary/90 text-white"
                                      : "text-gray-600 hover:bg-gray-100"
                                  )}
                                >
                                  <span>{child.label}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  );
                }

                if (hasChildren && !open) {
                  return (
                    <li key={item.id}>
                      <Popover>
                        <Tooltip>
                          <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                              <button
                                suppressHydrationWarning
                                className={twMerge(
                                  "flex h-[40px] w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                  isActive
                                    ? "bg-primary hover:bg-primary/90 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                )}
                              >
                                {item.icon}
                              </button>
                            </TooltipTrigger>
                          </PopoverTrigger>
                          <TooltipContent side="right" align="center">
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                        <PopoverContent side="right" align="start" className="w-48 p-2">
                          <div className="mb-2 border-b border-gray-200 pb-2">
                            <p className="text-sm font-bold">{item.label}</p>
                          </div>
                          <div className="space-y-1">
                            {item.children?.map((child) => (
                              <button
                                key={child.id}
                                onClick={() => handleNavigation(child.path)}
                                className={twMerge(
                                  "flex h-[36px] w-full cursor-pointer gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                  child.pathnames.includes(pathname)
                                    ? "bg-primary/80 hover:bg-primary/90 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                )}
                              >
                                <span>{child.label}</span>
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    {open ? (
                      <button
                        onClick={() => item.path && handleNavigation(item.path)}
                        className={twMerge(
                          "flex h-[40px] w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary hover:bg-primary/90 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            suppressHydrationWarning
                            onClick={() => item.path && handleNavigation(item.path)}
                            className={twMerge(
                              "flex h-[40px] w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            )}
                          >
                            {item.icon}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
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
