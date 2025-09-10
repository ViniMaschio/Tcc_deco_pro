"use client";

import { IoIosMenu, IoMdNotifications } from "react-icons/io";

import { Button } from "@/components/ui/button";
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

export const NavBar = () => {
  return (
    <>
      <div
        data-open={open}
        className="m-2 mx-1 flex h-16 w-[100%_-_80px] items-center gap-2 rounded-md bg-white px-3 shadow-sm data-[open=true]:w-[100%_-_288px]"
      >
        <div className="flex w-fit items-center justify-center">
          <Button
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground block h-10 w-10 gap-3 rounded-md border transition-all duration-300 xl:hidden"
            // onClick={() => setOpen(!open)}
          >
            <IoIosMenu size={20} />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <div className="relative h-10 w-10">
              <Button className="m-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-transparent p-0 transition-all duration-300 hover:bg-slate-400/15">
                <IoMdNotifications size={24} color="black" />
              </Button>
              {/* {data?.notificationPaginated.items.length > 0 && (
                <div className="bg-primary-red-500 absolute top-[10px] right-[10px] h-2 w-2 animate-pulse rounded-full" />
              )} */}
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

        <div className="ml-[auto] flex w-fit items-center justify-center gap-2">
          <div className="hidden flex-col items-end gap-1 xl:flex">
            <span className="text-sm font-bold uppercase">
              {/* {user?.userInfo?.nome || "-"} */}
            </span>
            {/* <span className="text-sm">{user?.userInfo?.email || "-"}</span> */}
          </div>
          <Menubar className="flex h-[3em] w-[3em] items-center justify-center border-0 hover:bg-none">
            <MenubarMenu>
              <MenubarTrigger>
                <div className="relative h-[3em] w-[3em] cursor-pointer overflow-hidden rounded-[50%] border-[1px] bg-[#6b7280]">
                  {/* {!!hasAvatar() ? (
                    <img
                      className="absolute h-full w-full"
                      src={hasAvatar()}
                      alt="Avatar do usuário conectado ao sistema"
                    />
                  ) : (
                    <UserRound
                      strokeWidth={0.5}
                      className="absolute h-full w-full"
                      color="snow"
                    />
                  )} */}
                </div>
              </MenubarTrigger>
              <MenubarContent className="mr-[0.5em] w-72 xl:w-fit">
                <div className="ml-2 flex w-full cursor-default items-center p-1">
                  <span className="hidden font-bold xl:block">Usuário</span>
                </div>
                <div className="flex flex-col gap-1 pl-2 xl:hidden">
                  <span className="text-md font-bold">
                    {/* {user?.userInfo?.nome || "-"} */}
                  </span>
                  <span className="text-xs">
                    {/* {user?.userInfo?.email || "-"} */}
                  </span>
                </div>
                {/* {menus.map((menu) => (
                  <div key={menu.label} onClick={() => clickedMenu(menu)}>
                    <MenubarSeparator />
                    <MenubarItem className="gap-4">
                      {menu.icon} {menu.label} {menu.warning && menu.warning}
                    </MenubarItem>
                  </div>
                ))} */}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </>
  );
};
