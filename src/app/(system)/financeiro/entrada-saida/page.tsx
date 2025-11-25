"use client";

import { PlusCircle } from "lucide-react";

import { ContaPagarDataTable } from "@/app/modules/financeiro/data-table-pagar";
import { ContaReceberDataTable } from "@/app/modules/financeiro/data-table-receber";
import {
  contaPagarFilterColsWithDates,
  contaReceberFilterColsWithDates,
} from "@/app/modules/financeiro/columns";
import { ContaPagarModal } from "@/app/modules/financeiro/modal-conta-pagar/conta-pagar-modal";
import { ContaReceberModal } from "@/app/modules/financeiro/modal-conta-receber/conta-receber-modal";
import { PagarModal } from "@/app/modules/financeiro/modal-conta-pagar/pagar-modal";
import { ReceberModal } from "@/app/modules/financeiro/modal-conta-receber/receber-modal";
import { IconButton } from "@/components/icon-button";
import { PageFilter } from "@/components/page-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrencyFromCents } from "@/utils/currency";

import { usePage } from "./use-page";

export default function Page() {
  const {
    resumoData,
    filters,
    contaPagar,
    contaReceber,
    isLoading,
    showState,
    pagination,
    isDeleting,
    setContaPagar,
    setContaReceber,
    afterSubmit,
    contasPagarItems,
    contasReceberItems,
    contaPagarColumns,
    contaReceberColumns,
    removeConta,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
    handlePagarSuccess,
    handleReceberSuccess,
  } = usePage();

  return (
    <>
      <div className="flex h-[calc(100dvh-100px)] w-full flex-col transition-all duration-500 sm:mx-1">
        <div>
          <div className="grid grid-cols-1 gap-4 bg-white p-6 md:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contas a Receber</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {resumoData ? formatCurrencyFromCents(resumoData.contasReceber) : "R$ 0,00"}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contas a Pagar</p>
                  <p className="mt-2 text-2xl font-bold text-red-600">
                    {resumoData ? formatCurrencyFromCents(resumoData.contasPagar) : "R$ 0,00"}
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo</p>
                  <p
                    className={`mt-2 text-2xl font-bold ${
                      resumoData && resumoData.saldo >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {resumoData ? formatCurrencyFromCents(resumoData.saldo) : "R$ 0,00"}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <Tabs
            value={showState.activeTab}
            onValueChange={(value) => changeShowState("activeTab", value as "receber" | "pagar")}
            className="flex h-full flex-col"
          >
            <div className="flex w-full flex-col bg-white p-6">
              <div className="flex justify-end">
                <div className="flex gap-2">
                  <PageFilter
                    changeFilter={handleChangeFilters}
                    clearFilters={handleClearFilters}
                    filterCols={
                      showState.activeTab === "pagar"
                        ? contaPagarFilterColsWithDates
                        : contaReceberFilterColsWithDates
                    }
                    filters={filters}
                  />
                  <IconButton
                    icon={<PlusCircle size={20} />}
                    onClick={() => {
                      if (showState.activeTab === "pagar") {
                        setContaPagar({} as any);
                      } else {
                        setContaReceber({} as any);
                      }
                      changeShowState("showModal", true);
                    }}
                    tooltip="Adicionar"
                    variant="primary"
                  />
                </div>
              </div>
              <TabsList className="mt-4 h-12 w-full">
                <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
                <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="receber" className="flex-1 overflow-auto p-0">
              <ContaReceberDataTable
                columns={contaReceberColumns}
                data={contasReceberItems}
                pagination={pagination}
                setPagination={changePagination}
                changeFilters={handleChangeFilters}
                clearFilters={handleClearFilters}
                filters={filters}
                isLoading={isLoading}
                showState={showState}
                changeShowState={changeShowState}
                removeConta={removeConta}
                isDeleting={isDeleting}
              />
            </TabsContent>

            <TabsContent value="pagar" className="flex-1 overflow-auto p-0">
              <ContaPagarDataTable
                columns={contaPagarColumns}
                data={contasPagarItems}
                pagination={pagination}
                setPagination={changePagination}
                changeFilters={handleChangeFilters}
                clearFilters={handleClearFilters}
                filters={filters}
                isLoading={isLoading}
                showState={showState}
                changeShowState={changeShowState}
                removeConta={removeConta}
                isDeleting={isDeleting}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showState.showModal && showState.activeTab === "pagar" ? (
        <ContaPagarModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setContaPagar({} as any);
          }}
          afterSubmit={afterSubmit}
          contaPagar={contaPagar}
        />
      ) : null}

      {showState.showModal && showState.activeTab === "receber" ? (
        <ContaReceberModal
          open={showState.showModal}
          changeOpen={(value) => {
            changeShowState("showModal", value);
            setContaReceber({} as any);
          }}
          afterSubmit={afterSubmit}
          contaReceber={contaReceber}
        />
      ) : null}

      {showState.showPagarModal && contaPagar?.id ? (
        <PagarModal
          open={showState.showPagarModal}
          onOpenChange={(value) => {
            changeShowState("showPagarModal", value);
            if (!value) {
              setContaPagar({} as any);
            }
          }}
          conta={contaPagar}
          onSuccess={handlePagarSuccess}
        />
      ) : null}

      {showState.showReceberModal && contaReceber?.id ? (
        <ReceberModal
          open={showState.showReceberModal}
          onOpenChange={(value) => {
            changeShowState("showReceberModal", value);
            if (!value) {
              setContaReceber({} as any);
            }
          }}
          conta={contaReceber}
          onSuccess={handleReceberSuccess}
        />
      ) : null}
    </>
  );
}
