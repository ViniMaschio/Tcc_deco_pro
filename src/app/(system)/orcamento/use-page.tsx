import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Orcamento } from "@/app/api/orcamento/types";
import { PaginationTable } from "@/app/api/types";
import { SortingType } from "@/components/sort-table";
import { orcamentoColumns, OrcamentoFilterType } from "@/app/modules/orcamento/columns";
import { OrcamentoPageStates } from "@/app/modules/orcamento/modal/types";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [orcamento, setOrcamento] = useState({} as Orcamento);

  const [showState, setShowState] = useState({} as OrcamentoPageStates);

  const [pagination, setPagination] = useState({
    perPage: 15,
    currentPage: 1,
    count: 0,
    pagesCount: 1,
  } as PaginationTable);

  const [filters, setFilters] = useState({
    sorting: {
      name: "id",
      type: "asc",
    },
  } as OrcamentoFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof OrcamentoPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getOrcamento = async (
    filtersParam: OrcamentoFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/orcamento?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Orçamentos!");
    }

    return response.json() as Promise<{
      data: Orcamento[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["orcamento", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getOrcamento(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/orcamento/${orcamento.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      changeShowState("showDialog", false);
      toast.success("Operação realizada com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const { mutateAsync: removeOrcamento, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteOrcamento"],
  });

  const handleChangeFilters = (
    name: string,
    value: string | number | boolean | SortingType | undefined
  ) => {
    if (!value)
      setFilters((filters) => ({
        ...filters,
        [name]: undefined,
      }));
    else {
      setFilters((filters) => ({
        ...filters,
        [name]: value,
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      status: "",
      dataEvento: "",
    }));
  };

  const handleEdit = (value: Orcamento) => {
    setOrcamento(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: Orcamento) => {
    setOrcamento(value);
    changeShowState("showDialog", true);
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    refetch();
  };

  const columns = orcamentoColumns;

  const orcamentoData = data?.items || [];

  return {
    data,
    filters,
    orcamento,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setOrcamento,
    afterSubmit,
    orcamentoData,
    columns,
    removeOrcamento,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  };
};
