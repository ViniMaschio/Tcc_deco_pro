import { getServerSession } from "next-auth";

import { LogOutButton } from "@/components/logout-button";
import { authOptions } from "@/lib/auth";

export const SideBar = async () => {
  const empresa = await getServerSession(authOptions);

  return (
    <>
      <div className="absolute z-40 -ml-2 data-[open=true]:h-screen data-[open=true]:w-screen data-[open=true]:bg-[rgba(0,0,0,0.3)] xl:z-10 xl:hidden" />
      <div className="absolute z-50 my-2 h-[calc(98vh)] w-0 rounded-lg bg-white opacity-0 transition-all duration-300 data-[open=true]:w-72 data-[open=true]:opacity-100 xl:relative xl:z-10 xl:w-20 xl:opacity-100">
        <div className="flex h-full w-full flex-col items-center justify-between gap-3 py-4">
          <div className="flex w-full flex-col items-center justify-center overflow-x-hidden overflow-y-auto border-0">
            {empresa?.user ? <LogOutButton /> : <span></span>}
          </div>
        </div>
      </div>
    </>
  );
};
