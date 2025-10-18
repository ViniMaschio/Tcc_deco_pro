"use client";

import { PlusCircle } from "lucide-react";

import { CategoriaFesta } from "@/app/api/categoria-festa/types";
import { CategoriaFestaDataTable } from "@/app/modules/categoria-festa/data-table";
import { CategoriaFestaModal } from "@/app/modules/categoria-festa/modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    categoriaFesta,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setCategoriaFesta,
    categoriaFestaData,
    afterSubmit,
    columns,
    removeCategoriaFesta,
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
                  filterCols={{
                    descricao: {
                      name: "descricao",
                      sortName: "descricao",
                      type: "text",
                      label: "Descrição",
                      sortable: true,
                    },
                  }}
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

        <CategoriaFestaDataTable
          columns={columns}
          data={categoriaFestaData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          filters={filters}
          clearFilters={handleClearFilters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeCategoriaFesta={removeCategoriaFesta}
          isDeleting={isDeleting}
        />
      </div>

      {showState.showModal ? (
        <CategoriaFestaModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setCategoriaFesta({} as CategoriaFesta);
          }}
          afterSubmit={afterSubmit}
          categoriaFesta={categoriaFesta}
        />
      ) : null}
    </>
  );
}
