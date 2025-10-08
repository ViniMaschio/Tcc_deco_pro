"use client";

import { PlusCircle } from "lucide-react";

import { Local } from "@/app/api/local/types";
import { columns, localFilterCols } from "@/app/modules/locais/columns";
import { LocalDataTable } from "@/app/modules/locais/data-table";
import { LocalModal } from "@/app/modules/locais/modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePage } from "./use-page";

export default function Page() {
  const {
    extraColumns,
    pagination,
    changePagination,
    handleChangeFilters,
    handleClearFilters,
    filters,
    changeShowState,
    showState,
    afterSubmit,
    localData,
    isLoading,
    local,
    setLocal,
    removeLocal,
    isDeleting,
  } = usePage();

  return (
    <>
      <div className="flex h-[calc(100dvh-100px)] w-full flex-col transition-all duration-500 sm:mx-1">
        <div>
          <div className="flex flex-col bg-white p-6">
            <div className="flex justify-end">
              <div className="flex gap-2">
                <PageFilter
                  changeFilter={handleChangeFilters}
                  clearFilters={handleClearFilters}
                  filterCols={localFilterCols}
                  filters={filters}
                />

                <IconButton
                  icon={<PlusCircle size={20} />}
                  onClick={() => changeShowState("showModal", true)}
                  tooltip="Adicionar"
                  variant="primary"
                />
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
          clearFilters={handleClearFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeLocal={removeLocal}
          isDeleting={isDeleting}
        />
      </div>

      <LocalModal
        open={showState.showModal}
        changeOpen={(value) => {
          changeShowState("showModal", value);
          setLocal({} as Local);
        }}
        afterSubmit={afterSubmit}
        local={local}
      />
    </>
  );
}
