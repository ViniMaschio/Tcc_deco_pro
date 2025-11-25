import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { CaixaEntrada } from "@/app/api/caixa-entrada/types";
import { CaixaSaida } from "@/app/api/caixa-saida/types";
import { PaginationTable } from "@/app/api/types";
import {
  createCaixaEntradaColumns,
  createCaixaSaidaColumns,
} from "@/app/modules/financeiro/fluxo-caixa-columns";
import { FinanceiroPageStates } from "@/app/modules/financeiro/types";

export const usePage = () => {
  const [showState, setShowState] = useState({
    activeTab: "receber" as "receber" | "pagar",
  } as FinanceiroPageStates);

  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    count: 0,
    pagesCount: 1,
  } as PaginationTable);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof FinanceiroPageStates, value: boolean | string) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getCaixaEntradas = async (paginationParam: PaginationTable) => {
    const response = await fetch(
      `/api/caixa-entrada?page=${paginationParam.currentPage}&perPage=${paginationParam.perPage}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar entradas no caixa!");
    }

    return response.json() as Promise<{
      data: CaixaEntrada[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const getCaixaSaidas = async (paginationParam: PaginationTable) => {
    const response = await fetch(
      `/api/caixa-saida?page=${paginationParam.currentPage}&perPage=${paginationParam.perPage}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar saídas no caixa!");
    }

    return response.json() as Promise<{
      data: CaixaSaida[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const {
    data: caixaEntradasData,
    isLoading: isLoadingEntradas,
    isFetching: isFetchingEntradas,
  } = useQuery({
    queryKey: ["caixa-entradas", pagination.currentPage, pagination.perPage],
    queryFn: () => getCaixaEntradas(pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
    enabled: showState.activeTab === "receber",
  });

  const {
    data: caixaSaidasData,
    isLoading: isLoadingSaidas,
    isFetching: isFetchingSaidas,
  } = useQuery({
    queryKey: ["caixa-saidas", pagination.currentPage, pagination.perPage],
    queryFn: () => getCaixaSaidas(pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
    enabled: showState.activeTab === "pagar",
  });

  const caixaEntradasItems = caixaEntradasData?.items || [];
  const caixaSaidasItems = caixaSaidasData?.items || [];

  const isLoading =
    showState.activeTab === "receber"
      ? isLoadingEntradas || isFetchingEntradas
      : isLoadingSaidas || isFetchingSaidas;

  // Atualizar paginação quando os dados chegarem
  useEffect(() => {
    if (caixaEntradasData?.meta && showState.activeTab === "receber") {
      setPagination((prev) => ({
        ...prev,
        count: caixaEntradasData.meta.total,
        pagesCount: caixaEntradasData.meta.totalPages,
      }));
    }

    if (caixaSaidasData?.meta && showState.activeTab === "pagar") {
      setPagination((prev) => ({
        ...prev,
        count: caixaSaidasData.meta.total,
        pagesCount: caixaSaidasData.meta.totalPages,
      }));
    }
  }, [caixaEntradasData?.meta, caixaSaidasData?.meta, showState.activeTab]);

  const caixaEntradaColumns = createCaixaEntradaColumns();
  const caixaSaidaColumns = createCaixaSaidaColumns();

  return {
    showState,
    isLoading,
    pagination,
    caixaEntradasItems,
    caixaSaidasItems,
    caixaEntradaColumns,
    caixaSaidaColumns,
    changeShowState,
    changePagination,
  };
};
