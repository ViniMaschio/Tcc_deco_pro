"use client";

import { PlusCircle } from "lucide-react";
import { useEffect } from "react";

import { Orcamento } from "@/app/api/orcamento/types";
import { orcamentoFilterCols } from "@/app/modules/orcamento/columns";
import { OrcamentoDataTable } from "@/app/modules/orcamento/data-table";
import { OrcamentoModal } from "@/app/modules/orcamento/modal";
import { ViewItemsModal } from "@/app/modules/orcamento/view-modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";

import { usePage } from "./use-page";

export default function Page() {
  const {
    filters,
    orcamento,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setOrcamento,
    orcamentoData,
    afterSubmit,
    columns,
    removeOrcamento,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
    handleViewOrcamento,
    handleEdit,
    handleShowDelete,
    handleApproveOrcamento,
    handleRejectOrcamento,
    handleGeneratePdfOrcamento,
  } = usePage();

  useEffect(() => {
    const handleApprove = (event: Event) => {
      const customEvent = event as CustomEvent<Orcamento>;
      handleApproveOrcamento(customEvent.detail);
    };

    const handleReject = (event: Event) => {
      const customEvent = event as CustomEvent<Orcamento>;
      handleRejectOrcamento(customEvent.detail);
    };

    const handleGeneratePdf = (event: Event) => {
      const customEvent = event as CustomEvent<Orcamento>;
      handleGeneratePdfOrcamento(customEvent.detail);
    };

    window.addEventListener("approveOrcamento", handleApprove);
    window.addEventListener("rejectOrcamento", handleReject);
    window.addEventListener("generatePdfOrcamento", handleGeneratePdf);

    return () => {
      window.removeEventListener("approveOrcamento", handleApprove);
      window.removeEventListener("rejectOrcamento", handleReject);
      window.removeEventListener("generatePdfOrcamento", handleGeneratePdf);
    };
  }, [handleApproveOrcamento, handleRejectOrcamento, handleGeneratePdfOrcamento]);

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
                  filterCols={orcamentoFilterCols}
                  filters={filters}
                />

                <IconButton
                  icon={<PlusCircle size={20} />}
                  onClick={() => {
                    setOrcamento({} as Orcamento);
                    changeShowState("showModal", true);
                  }}
                  tooltip="Adicionar"
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>

        <OrcamentoDataTable
          columns={columns}
          data={orcamentoData || []}
          pagination={pagination}
          setPagination={changePagination}
          changeFilters={handleChangeFilters}
          clearFilters={handleClearFilters}
          filters={filters}
          isLoading={isLoading}
          showState={showState}
          changeShowState={changeShowState}
          removeOrcamento={removeOrcamento}
          isDeleting={isDeleting}
          onViewOrcamento={handleViewOrcamento}
          onEditOrcamento={handleEdit}
          onDeleteOrcamento={handleShowDelete}
        />
      </div>

      {showState.showModal ? (
        <OrcamentoModal
          open={showState.showModal}
          onOpenChange={(value: boolean) => {
            changeShowState("showModal", value);
            if (!value) {
              setOrcamento({} as Orcamento);
            }
          }}
          orcamento={orcamento?.id ? orcamento : undefined}
          onSuccess={afterSubmit}
        />
      ) : null}

      {showState.showViewModal ? (
        <ViewItemsModal
          open={showState.showViewModal}
          onOpenChange={(value: boolean) => {
            changeShowState("showViewModal", value);
            setOrcamento({} as Orcamento);
          }}
          orcamentoId={orcamento?.id}
        />
      ) : null}
    </>
  );
}
