import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CaixaEntrada } from "@/app/api/caixa-entrada/types";
import { CaixaSaida } from "@/app/api/caixa-saida/types";
import { PaginationTable } from "@/app/api/types";
import {
  createCaixaEntradaColumns,
  createCaixaSaidaColumns,
} from "@/app/modules/financeiro/fluxo-caixa-columns";
import { FinanceiroPageStates } from "@/app/modules/financeiro/types";

// Função para obter primeiro e último dia do mês
const getFirstAndLastDayOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    firstDay: firstDay.toISOString().split("T")[0],
    lastDay: lastDay.toISOString().split("T")[0],
  };
};

export const usePage = () => {
  const queryClient = useQueryClient();
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth();

  const [showState, setShowState] = useState({
    activeTab: "receber" as "receber" | "pagar",
    showDialog: false,
  } as FinanceiroPageStates);

  const [itemToDelete, setItemToDelete] = useState<CaixaEntrada | CaixaSaida | null>(null);

  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    count: 0,
    pagesCount: 1,
  } as PaginationTable);

  const [filters, setFilters] = useState({
    dataInicio: firstDay,
    dataFim: lastDay,
  });

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

  const handleChangeFilters = (name: string, value: string | Date | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value instanceof Date ? value.toISOString().split("T")[0] : value,
    }));
  };

  const handleClearFilters = () => {
    const { firstDay: first, lastDay: last } = getFirstAndLastDayOfMonth();
    setFilters({
      dataInicio: first,
      dataFim: last,
    });
  };

  const getCaixaEntradas = async (
    paginationParam: PaginationTable,
    filtersParam: typeof filters
  ) => {
    const queryParams = new URLSearchParams({
      page: paginationParam.currentPage.toString(),
      perPage: paginationParam.perPage.toString(),
    });

    if (filtersParam.dataInicio) {
      queryParams.append("dataInicio", filtersParam.dataInicio);
    }
    if (filtersParam.dataFim) {
      queryParams.append("dataFim", filtersParam.dataFim);
    }

    const response = await fetch(`/api/caixa-entrada?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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

  const getCaixaSaidas = async (paginationParam: PaginationTable, filtersParam: typeof filters) => {
    const queryParams = new URLSearchParams({
      page: paginationParam.currentPage.toString(),
      perPage: paginationParam.perPage.toString(),
    });

    if (filtersParam.dataInicio) {
      queryParams.append("dataInicio", filtersParam.dataInicio);
    }
    if (filtersParam.dataFim) {
      queryParams.append("dataFim", filtersParam.dataFim);
    }

    const response = await fetch(`/api/caixa-saida?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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

  const getResumo = async (filtersParam: typeof filters) => {
    const queryParams = new URLSearchParams();
    if (filtersParam.dataInicio) {
      queryParams.append("dataInicio", filtersParam.dataInicio);
    }
    if (filtersParam.dataFim) {
      queryParams.append("dataFim", filtersParam.dataFim);
    }

    const response = await fetch(`/api/financeiro/fluxo-caixa-resumo?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar resumo do fluxo de caixa!");
    }

    return response.json() as Promise<{
      contasRecebidas: number;
      contasPagas: number;
      saldo: number;
    }>;
  };

  const { data: resumoData } = useQuery({
    queryKey: ["fluxo-caixa-resumo", filters],
    queryFn: () => getResumo(filters),
  });

  const {
    data: caixaEntradasData,
    isLoading: isLoadingEntradas,
    isFetching: isFetchingEntradas,
  } = useQuery({
    queryKey: ["caixa-entradas", pagination.currentPage, pagination.perPage, filters],
    queryFn: () => getCaixaEntradas(pagination, filters),
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
    queryKey: ["caixa-saidas", pagination.currentPage, pagination.perPage, filters],
    queryFn: () => getCaixaSaidas(pagination, filters),
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

  const deleteCaixaEntrada = async (id: number) => {
    const response = await fetch(`/api/caixa-entrada/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao excluir entrada no caixa");
    }

    return response.json();
  };

  const deleteCaixaSaida = async (id: number) => {
    const response = await fetch(`/api/caixa-saida/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao excluir saída no caixa");
    }

    return response.json();
  };

  const deleteEntradaMutation = useMutation({
    mutationFn: deleteCaixaEntrada,
    onSuccess: () => {
      toast.success("Entrada no caixa excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caixa-entradas"] });
      queryClient.invalidateQueries({ queryKey: ["fluxo-caixa-resumo"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteSaidaMutation = useMutation({
    mutationFn: deleteCaixaSaida,
    onSuccess: () => {
      toast.success("Saída no caixa excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caixa-saidas"] });
      queryClient.invalidateQueries({ queryKey: ["fluxo-caixa-resumo"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (item: CaixaEntrada | CaixaSaida) => {
    setItemToDelete(item);
    changeShowState("showDialog", true);
  };

  const removeItem = () => {
    if (!itemToDelete) return;

    if ("contasReceberId" in itemToDelete && itemToDelete.contasReceberId) {
      // É uma entrada no caixa
      deleteEntradaMutation.mutate(itemToDelete.id, {
        onSuccess: () => {
          changeShowState("showDialog", false);
          setItemToDelete(null);
        },
      });
    } else if ("contasPagarId" in itemToDelete && itemToDelete.contasPagarId) {
      // É uma saída no caixa
      deleteSaidaMutation.mutate(itemToDelete.id, {
        onSuccess: () => {
          changeShowState("showDialog", false);
          setItemToDelete(null);
        },
      });
    }
  };

  const caixaEntradaColumns = createCaixaEntradaColumns({ onDelete: handleDelete });
  const caixaSaidaColumns = createCaixaSaidaColumns({ onDelete: handleDelete });

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
    resumoData,
    filters,
    handleChangeFilters,
    handleClearFilters,
    removeItem,
    isDeleting: deleteEntradaMutation.isPending || deleteSaidaMutation.isPending,
  };
};
