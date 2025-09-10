"use client";

import { usePathname, useRouter } from "next/navigation";

export const SideBar = () => {
  const push = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div></div>
    </>
  );
};
