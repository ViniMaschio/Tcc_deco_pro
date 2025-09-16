"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { useShallow } from "zustand/react/shallow";

import { useSidebarStore } from "@/store/sidebar";

import { menuItems } from "./menu";

export const SideBar = () => {
  const [open] = useSidebarStore(useShallow((state) => [state.open]));

  const router = useRouter();
  const pathname = usePathname();

  const [cadastrosOpen, setCadastrosOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/login`,
    });
  };

  return (
    <div
      className={`m-2 mr-1 hidden rounded-md bg-white transition-all duration-300 xl:block ${
        open ? "w-50" : "w-16"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-2">
            <img
              src="/static/images/logo_collapse.png"
              alt="DecoPro"
              className="h-8 w-8"
            />
            {open && (
              <span className="text-xl font-bold text-gray-800">DecoPro</span>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {Number(item.submenus?.length) > 0 ? (
                  <div>
                    <button
                      onClick={() => setCadastrosOpen(!cadastrosOpen)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        item.pathnames.includes(pathname)
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {open && <span>{item.label}</span>}
                      </div>
                      {open && (
                        <MdExpandMore
                          size={16}
                          className={`transition-transform ${cadastrosOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    {open && cadastrosOpen && (
                      <ul className="mt-1 space-y-1 pl-6">
                        <li>
                          <button
                            onClick={() =>
                              handleNavigation("/cadastros/clientes")
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
                          >
                            <span>Clientes</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              handleNavigation("/cadastros/fornecedores")
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
                          >
                            <span>Fornecedores</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              handleNavigation("/cadastros/locais")
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
                          >
                            <span>Locais</span>
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item?.path || "")}
                    className={`flex w-full rounded-lg text-sm font-medium transition-colors ${
                      item.pathnames.includes(pathname)
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex gap-3 p-2.5">
                      {item.icon}
                      {open && <span>{item.label}</span>}
                    </div>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <div className="flex gap-3 px-3 py-2.5">
              <IoLogOutOutline size={20} />
              {open && <span>Sair</span>}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
