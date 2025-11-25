import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ContaPagar } from "@/app/api/conta-pagar/types";
import { ContaReceber } from "@/app/api/conta-receber/types";
import { PaginationTable } from "@/app/api/types";
import {
  createContaPagarColumns,
  createContaReceberColumns,
} from "@/app/modules/financeiro/columns";
import { FinanceiroFilterType, FinanceiroPageStates } from "@/app/modules/financeiro/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [contaPagar, setContaPagar] = useState({} as ContaPagar);
  const [contaReceber, setContaReceber] = useState({} as ContaReceber);

  const [showState, setShowState] = useState({
    showModal: false,
    isLoading: false,
    showDialog: false,
    activeTab: "pagar" as "receber" | "pagar",
  } as FinanceiroPageStates);

  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    count: 0,
    pagesCount: 1,
  } as PaginationTable);

  const [filters, setFilters] = useState({
    sorting: {
      name: "id",
      type: "asc",
    },
  } as FinanceiroFilterType);

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

  const getContasPagar = async (
    filtersParam: FinanceiroFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/conta-pagar?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Contas a Pagar!");
    }

    return response.json() as Promise<{
      data: ContaPagar[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const getContasReceber = async (
    filtersParam: FinanceiroFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/conta-receber?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Contas a Receber!");
    }

    return response.json() as Promise<{
      data: ContaReceber[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const getResumo = async () => {
    const response = await fetch("/api/financeiro/resumo", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar resumo financeiro!");
    }

    return response.json() as Promise<{
      contasReceber: number;
      contasPagar: number;
      saldo: number;
    }>;
  };

  const { data: resumoData, refetch: refetchResumo } = useQuery({
    queryKey: ["financeiro-resumo"],
    queryFn: getResumo,
  });

  const {
    data: contasPagarData,
    isLoading: isLoadingPagar,
    isFetching: isFetchingPagar,
    refetch: refetchPagar,
  } = useQuery({
    queryKey: ["conta-pagar", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getContasPagar(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
    enabled: showState.activeTab === "pagar",
  });

  const {
    data: contasReceberData,
    isLoading: isLoadingReceber,
    isFetching: isFetchingReceber,
    refetch: refetchReceber,
  } = useQuery({
    queryKey: ["conta-receber", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getContasReceber(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
    enabled: showState.activeTab === "receber",
  });

  const handleDeletePagar = async () => {
    try {
      await fetch(`/api/conta-pagar/${contaPagar.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      changeShowState("showDialog", false);
      toast.success("Operação realizada com sucesso!", {
        position: "top-center",
      });
      refetchPagar();
      refetchResumo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReceber = async () => {
    try {
      await fetch(`/api/conta-receber/${contaReceber.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      changeShowState("showDialog", false);
      toast.success("Operação realizada com sucesso!", {
        position: "top-center",
      });
      refetchReceber();
      refetchResumo();
    } catch (error) {
      console.error(error);
    }
  };

  const { mutateAsync: removeContaPagar, isPending: isDeletingPagar } = useMutation({
    mutationFn: handleDeletePagar,
    mutationKey: ["deleteContaPagar"],
  });

  const { mutateAsync: removeContaReceber, isPending: isDeletingReceber } = useMutation({
    mutationFn: handleDeleteReceber,
    mutationKey: ["deleteContaReceber"],
  });

  const handleChangeFilters = (
    name: string,
    value: string | number | boolean | SortingType | Date | undefined
  ) => {
    if (!value) {
      setFilters((filters) => ({
        ...filters,
        [name]: undefined,
      }));
    } else {
      setFilters((filters) => ({
        ...filters,
        [name]: value,
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      descricao: undefined,
      status: undefined,
    }));
  };

  const handleEditPagar = (value: ContaPagar) => {
    setContaPagar(value);
    changeShowState("showModal", true);
  };

  const handleShowDeletePagar = (value: ContaPagar) => {
    setContaPagar(value);
    changeShowState("showDialog", true);
  };

  const handleEditReceber = (value: ContaReceber) => {
    setContaReceber(value);
    changeShowState("showModal", true);
  };

  const handleShowDeleteReceber = (value: ContaReceber) => {
    setContaReceber(value);
    changeShowState("showDialog", true);
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    if (showState.activeTab === "pagar") {
      refetchPagar();
    } else {
      refetchReceber();
    }
    refetchResumo();
  };

  const contaPagarColumns = createContaPagarColumns({
    onEdit: handleEditPagar,
    onDelete: handleShowDeletePagar,
  });

  const contaReceberColumns = createContaReceberColumns({
    onEdit: handleEditReceber,
    onDelete: handleShowDeleteReceber,
  });

  const contasPagarItems = contasPagarData?.items || [];
  const contasReceberItems = contasReceberData?.items || [];

  const isLoading =
    showState.activeTab === "pagar"
      ? isLoadingPagar || isFetchingPagar
      : isLoadingReceber || isFetchingReceber;
  const isDeleting = showState.activeTab === "pagar" ? isDeletingPagar : isDeletingReceber;
  const removeConta = showState.activeTab === "pagar" ? removeContaPagar : removeContaReceber;

  return {
    resumoData,
    filters,
    contaPagar,
    contaReceber,
    showState,
    isLoading,
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
  };
};
