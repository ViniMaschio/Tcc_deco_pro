"use client";

import { PlusCircle } from "lucide-react";

import { Contrato } from "@/app/api/contrato/types";
import { contratoFilterCols } from "@/app/modules/contrato/columns";
import { ContratoDataTable } from "@/app/modules/contrato/data-table";
import { ContratoModal } from "@/app/modules/contrato/modal";
import { ViewContratoModal } from "@/app/modules/contrato/view-modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    contrato,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setContrato,
    contratoData,
    afterSubmit,
    columns,
    removeContrato,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
    handleViewContrato,
    handleEdit,
    handleShowDelete,
    handleApproveContrato,
    handleCancelContrato,
    handleConcludeContrato,
    handleGeneratePdfContrato,
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
                  filterCols={contratoFilterCols}
                  filters={filters}
                />

                <IconButton
                  icon={<PlusCircle size={20} />}
                  onClick={() => {
                    setContrato({} as Contrato);
                    changeShowState("showModal", true);
                  }}
                  tooltip="Adicionar"
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>

        <ContratoDataTable
          columns={columns}
          data={contratoData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          clearFilters={handleClearFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeContrato={removeContrato}
          isDeleting={isDeleting}
          onViewContrato={handleViewContrato}
          onEditContrato={handleEdit}
          onDeleteContrato={handleShowDelete}
          onApproveContrato={handleApproveContrato}
          onCancelContrato={handleCancelContrato}
          onConcludeContrato={handleConcludeContrato}
          onGeneratePdfContrato={handleGeneratePdfContrato}
        />
      </div>

      {showState.showModal ? (
        <ContratoModal
          open={showState.showModal}
          onOpenChange={(value: boolean) => {
            changeShowState("showModal", value);
            if (!value) {
              setContrato({} as Contrato);
            }
          }}
          contrato={contrato?.id ? contrato : undefined}
          onSuccess={afterSubmit}
        />
      ) : null}

      {showState.showViewModal ? (
        <ViewContratoModal
          open={showState.showViewModal}
          onOpenChange={(value: boolean) => {
            changeShowState("showViewModal", value);
            setContrato({} as Contrato);
          }}
          contratoId={contrato?.id || null}
        />
      ) : null}
    </>
  );
}
