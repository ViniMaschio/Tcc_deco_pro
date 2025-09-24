"use client";

import { IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { IoIosMenu, IoMdNotifications, IoMdSettings } from "react-icons/io";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarLeftExpandFilled,
} from "react-icons/tb";
import { useShallow } from "zustand/react/shallow";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/store/sidebar";

export const NavBar = () => {
  const [open, setOpen] = useSidebarStore(
    useShallow((state) => [state.open, state.setOpen]),
  );

  const pathname = usePathname();

  // Função para obter o título da página baseado na rota
  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/agenda":
        return "Agenda";
      case "/contratos":
        return "Contratos";
      case "/orcamentos":
        return "Orçamentos";
      case "/financeiro":
        return "Financeiro";
      case "/fornecedores":
        return "Fornecedores";
      case "/locais":
        return "Locais";
      default:
        return "";
    }
  };

  return (
    <>
      <div
        data-open={open}
        className="mx-1 mt-2 flex h-16 w-[100%_-_80px] items-center gap-2 rounded-t-md border-b bg-white px-3 data-[open=true]:w-[100%_-_288px]"
      >
        <div className="hidden w-fit px-2 xl:flex">
          <IconButton
            onClick={() => setOpen(!open)}
            variant="ghost"
            color="gray"
          >
            {open ? (
              <TbLayoutSidebarLeftCollapseFilled size={30} color="black" />
            ) : (
              <TbLayoutSidebarLeftExpandFilled size={30} color="black" />
            )}
          </IconButton>
        </div>
        <div className="flex flex-col px-2 xl:hidden xl:gap-4 xl:pl-14">
          <Sheet>
            <SheetTrigger asChild className="px-2">
              <IconButton variant="outline" color="gray">
                <IoIosMenu size={20} color="black" />
                <span className="sr-only">Abrir / Fechar menu</span>
              </IconButton>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img
                    src="/static/images/logo_collapse.png"
                    alt="Logo do Projeto"
                    className="h-5 w-5"
                  />
                  DecoPro
                </SheetTitle>
              </SheetHeader>

              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <Link href={"#"}>text</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Título da página no centro */}
        <div className="flex flex-1 justify-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="ml-[auto] flex w-fit items-center justify-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <div>
                <IconButton variant="ghost" color="gray">
                  <IoMdNotifications size={24} color="black" />
                </IconButton>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  Notificações
                  {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button className="m-0 h-8 w-8 rounded-lg bg-transparent p-0 transition-all duration-300 hover:bg-slate-500/15">
                      <Filter size={16} className="text-primary-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="animate-slideDownAndFade flex w-56 flex-col justify-center gap-2 bg-white px-0 py-2">
                    <div className="w-full p-2">
                      <InputSelectForm
                        name="modulo"
                        label="Módulo"
                        value={
                          module === undefined
                            ? "0"
                            : typeEnum
                                .find((t) => t.description === module)
                                ?.id.toString()
                        }
                        items={[...typeEnum]}
                        onChange={(value: {
                          id: number;
                          description: string;
                        }) => handleChangeModule(value)}
                      />
                    </div>
                  </PopoverContent>
                </Popover> */}
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>
              {/* <Notification
              read={{
                data: dataRead?.notificationPaginated,
                loading: loadingRead,
                refetch: getReadNotifications,
                pagination: notificationPagination.read,
                setPagination: (value) =>
                  setNotificationPagination((prev) => ({
                    ...prev,
                    read: value,
                  })),
              }}
              unread={{
                data: data?.notificationPaginated,
                loading,
                refetch: getUnreadNotifications,
                pagination: notificationPagination.unread,
                setPagination: (value) =>
                  setNotificationPagination((prev) => ({
                    ...prev,
                    unread: value,
                  })),
              }}
            /> */}
            </SheetContent>
          </Sheet>
          <Menubar className="flex h-[3em] w-[3em] items-center justify-center border-0 hover:bg-none">
            <MenubarMenu>
              <MenubarTrigger>
                <div className="relative flex h-[2em] w-[2em] cursor-pointer items-end justify-center overflow-hidden rounded-[50%] border-[1px] bg-gray-300">
                  <FaUserAlt className="text-center text-gray-700" size={20} />
                </div>
              </MenubarTrigger>
              <MenubarContent className="mr-[0.5em] w-72 p-2 xl:w-fit">
                <div className="flex items-center pb-1">
                  <div className="relative flex h-[2em] w-[2em] items-end justify-center overflow-hidden rounded-[50%] border-[1px] bg-gray-300">
                    <FaUserAlt
                      className="text-center text-gray-700"
                      size={20}
                    />
                  </div>
                  <div className="flex flex-col pl-2">
                    <span className="text-sm font-semibold">Gabriel</span>
                    <span className="text-xs text-black">
                      gabrielribeiromaschio@hotmail.com
                    </span>
                  </div>
                </div>
                <MenubarSeparator />
                <MenubarItem className="gap-4 text-sm">
                  <IoMdSettings color="black" />
                  Configurações
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </>
  );
};
