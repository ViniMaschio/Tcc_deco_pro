"use client";

import { PlusCircle } from "lucide-react";

import { Fornecedor } from "@/app/api/fornecedor/types";
import { fornecedorFilterCols } from "@/app/modules/fornecedor/columns";
import { FornecedorDataTable } from "@/app/modules/fornecedor/data-table";
import { FornecedorModal } from "@/app/modules/fornecedor/modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    fornecedor,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setFornecedor,
    fornecedorData,
    afterSubmit,
    columns,
    removeFornecedor,
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
                  filterCols={fornecedorFilterCols}
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

        <FornecedorDataTable
          columns={columns}
          data={fornecedorData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          clearFilters={handleClearFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeFornecedor={removeFornecedor}
          isDeleting={isDeleting}
        />
      </div>

      {showState.showModal ? (
        <FornecedorModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setFornecedor({} as Fornecedor);
          }}
          afterSubmit={afterSubmit}
          fornecedor={fornecedor}
        />
      ) : null}
    </>
  );
}
