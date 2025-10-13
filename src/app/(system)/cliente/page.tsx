"use client";

import { PlusCircle } from "lucide-react";

import { Cliente } from "@/app/api/cliente/types";
import { clienteFilterCols, columns } from "@/app/modules/cliente/columns";
import { ClienteDataTable } from "@/app/modules/cliente/data-table";
import { ClienteModal } from "@/app/modules/cliente/modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    cliente,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setCliente,
    clienteData,
    afterSubmit,
    extraColumns,
    removeCliente,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
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
                  filterCols={clienteFilterCols}
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

        <ClienteDataTable
          columns={[...columns, ...extraColumns]}
          data={clienteData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          clearFilters={handleClearFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeCliente={removeCliente}
          isDeleting={isDeleting}
        />
      </div>

      {showState.showModal ? (
        <ClienteModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setCliente({} as Cliente);
          }}
          afterSubmit={afterSubmit}
          cliente={cliente}
        />
      ) : null}
    </>
  );
}
