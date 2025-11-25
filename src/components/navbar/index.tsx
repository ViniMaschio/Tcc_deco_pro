"use client";

import { useState } from "react";
import Image from "next/image";
import { IconButton } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FaUserAlt } from "react-icons/fa";
import { IoIosMenu, IoMdNotifications, IoMdSettings } from "react-icons/io";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useSidebarStore } from "@/store/sidebar";
import { useEmpresa } from "@/hooks/use-empresa";
import { obterEmpresa } from "@/actions/empresa";
import { ConfiguracoesModal } from "./configuracao/modal";
import { useNavBar } from "./use-index";

export const NavBar = () => {
  const [open, setOpen] = useSidebarStore(useShallow((state) => [state.open, state.setOpen]));
  const { data: session } = useSession();
  const { empresa: empresaSession, loading: empresaLoading } = useEmpresa();

  const { data: empresaData } = useQuery({
    queryKey: ["empresa-navbar", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const resultado = await obterEmpresa(Number(session.user.id));
      return resultado.ok ? resultado.data : null;
    },
    enabled: !!session?.user?.id,
  });

  const empresa = empresaData || empresaSession;
  const logoUrl = empresaData?.logoUrl;

  const { showState, changeShowState, getPageTitle } = useNavBar();

  return (
    <>
      <div
        data-open={open}
        className="mx-1 mt-2 flex h-16 w-[100%-80px] items-center gap-2 rounded-t-md border-b bg-white px-3 data-[open=true]:w-[100%-288px]"
      >
        <div className="hidden w-fit px-2 xl:flex">
          <IconButton onClick={() => setOpen(!open)} variant="ghost" color="gray">
            {open ? (
              <TbLayoutSidebarLeftCollapseFilled size={30} color="black" />
            ) : (
              <TbLayoutSidebarLeftExpandFilled size={30} color="black" />
            )}
          </IconButton>
        </div>
        <div className="flex flex-col px-2 xl:hidden xl:gap-4 xl:pl-14">
          <IconButton onClick={() => setOpen(true)} variant="outline" color="gray" className="px-2">
            <IoIosMenu size={20} color="black" />
            <span className="sr-only">Abrir menu</span>
          </IconButton>
        </div>

        <div className="flex flex-1 justify-center">
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        </div>

        <div className="ml-auto flex w-fit items-center justify-center gap-4">
          <Menubar className="flex h-[3em] w-[3em] items-center justify-center border-0 hover:bg-none">
            <MenubarMenu>
              <MenubarTrigger>
                <div className="relative flex h-[2em] w-[2em] cursor-pointer items-center justify-center overflow-hidden rounded-[50%] border bg-gray-300">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={empresaData?.nome || (empresaSession as any)?.name || "Logo"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FaUserAlt className="text-center text-gray-700" size={20} />
                  )}
                </div>
              </MenubarTrigger>
              <MenubarContent className="mr-[0.5em] w-72 p-2 xl:w-fit">
                <div className="flex items-center pb-1">
                  <div className="relative flex h-[2em] w-[2em] items-center justify-center overflow-hidden rounded-[50%] border bg-gray-300">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={empresaData?.nome || (empresaSession as any)?.name || "Logo"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <FaUserAlt className="text-center text-gray-700" size={20} />
                    )}
                  </div>
                  <div className="flex flex-col pl-2">
                    {empresaLoading ? (
                      <>
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-300"></div>
                      </>
                    ) : empresa ? (
                      <>
                        <span className="text-sm font-semibold">
                          {empresaData?.nome || (empresaSession as any)?.name || "Empresa"}
                        </span>
                        <span className="text-xs text-black">{empresa.email}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold">Usuário</span>
                        <span className="text-xs text-black">Não logado</span>
                      </>
                    )}
                  </div>
                </div>
                <MenubarSeparator />
                <MenubarItem
                  className="cursor-pointer gap-4 text-sm"
                  onClick={() => changeShowState("showModal", true)}
                >
                  <IoMdSettings color="black" />
                  Configurações
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      {}
      {showState.showModal ? (
        <ConfiguracoesModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
          }}
        />
      ) : null}
    </>
  );
};
