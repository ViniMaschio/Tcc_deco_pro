"use client";

import {
  FolderPlusIcon,
  MapPinIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import { PlusCircle } from "lucide-react";

import { columns } from "@/app/modules/locais/columns";
import { LocalDataTable } from "@/app/modules/locais/data-table";
import { LocalModal } from "@/app/modules/locais/modal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { usePage } from "./use-page";

export default function Page() {
  const {
    extraColumns,
    pagination,
    setPagination,
    changePagination,
    handleChangeFilters,
    handleClearFilters,
    setDataTable,
    filters,
    setFilters,
    handleEdit,
    changeShowState,
    showState,
    afterSubmit,
    localData,
  } = usePage();

  return (
    <>
      <div className="flex h-[calc(100dvh-100px)] w-full flex-col transition-all duration-500 sm:mx-1">
        <div>
          <div className="flex flex-col bg-white p-6">
            <div className="flex justify-end">
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button>
                      <PlusCircleIcon size={20} />
                      Novo
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="flex flex-col gap-2 p-3"
                  >
                    <button
                      // onClick={onAdd}
                      className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-100"
                    >
                      <PlusCircle size={24} />
                      Criação
                    </button>
                    <Separator />
                    <button
                      // onClick={secondAdd}
                      className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-100"
                    >
                      <FolderPlusIcon size={24} />
                      Criação Rápida
                    </button>
                  </PopoverContent>
                </Popover>

                <Button onClick={() => changeShowState("showModal", true)}>
                  <PlusCircle size={20} />
                  Novo
                </Button>
              </div>
            </div>
          </div>
        </div>
        <LocalDataTable
          columns={[...columns, ...extraColumns]}
          data={localData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          setDataTable={setDataTable}
          clearFilters={handleClearFilters}
          filters={filters}
          handleEdit={handleEdit}
          isLoading={showState.isLoading}
        />
      </div>

      <LocalModal
        open={showState.showModal}
        changeOpen={(value) => changeShowState("showModal", value)}
        afterSubmit={afterSubmit}
      />
    </>
  );
}
