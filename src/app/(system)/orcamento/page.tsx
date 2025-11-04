"use client";

import { PlusCircle } from "lucide-react";

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
    showEditModal,
    setShowEditModal,
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
                  filterCols={orcamentoFilterCols}
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
            setOrcamento({} as Orcamento);
          }}
          mode="create"
          data={orcamento}
          onSuccess={afterSubmit}
        />
      ) : null}

      {showEditModal ? (
        <OrcamentoModal
          open={showEditModal}
          onOpenChange={(value: boolean) => {
            setShowEditModal(value);
            setOrcamento({} as Orcamento);
          }}
          mode="edit"
          data={orcamento}
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
