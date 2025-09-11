"use client";

import { usePathname, useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { useSidebarStore } from "@/store/sidebar";

export const SideBar = () => {
  const [open, setOpen] = useSidebarStore(
    useShallow((state) => [state.open, state.setOpen]),
  );

  const push = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div></div>
    </>
  );
};
