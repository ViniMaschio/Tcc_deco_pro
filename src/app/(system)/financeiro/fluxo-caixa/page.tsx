"use client";

import { FluxoCaixaDataTable } from "@/app/modules/financeiro/fluxo-caixa-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePage } from "./use-page";

export default function Page() {
  const {
    isLoading,
    showState,
    pagination,
    caixaEntradasItems,
    caixaSaidasItems,
    caixaEntradaColumns,
    caixaSaidaColumns,
    changeShowState,
    changePagination,
  } = usePage();

  return (
    <div className="flex h-[calc(100dvh-100px)] w-full flex-col transition-all duration-500 sm:mx-1">
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <Tabs
          value={showState.activeTab}
          onValueChange={(value) => changeShowState("activeTab", value as "receber" | "pagar")}
          className="flex h-full flex-col"
        >
          <div className="flex w-full flex-col bg-white p-6">
            <TabsList className="h-12 w-full">
              <TabsTrigger value="receber">Entradas no Caixa</TabsTrigger>
              <TabsTrigger value="pagar">Saídas do Caixa</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="receber" className="flex-1 overflow-auto p-0">
            <FluxoCaixaDataTable
              columns={caixaEntradaColumns}
              data={caixaEntradasItems}
              pagination={pagination}
              setPagination={changePagination}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="pagar" className="flex-1 overflow-auto p-0">
            <FluxoCaixaDataTable
              columns={caixaSaidaColumns}
              data={caixaSaidasItems}
              pagination={pagination}
              setPagination={changePagination}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
