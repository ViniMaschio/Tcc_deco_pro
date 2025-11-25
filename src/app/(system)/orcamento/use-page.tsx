import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Orcamento } from "@/app/api/orcamento/types";
import { PaginationTable } from "@/app/api/types";
import { orcamentoColumns, OrcamentoFilterType } from "@/app/modules/orcamento/columns";
import { OrcamentoPageStates } from "@/app/modules/orcamento/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [orcamento, setOrcamento] = useState({} as Orcamento);

  const [showState, setShowState] = useState({
    showModal: false,
    showDialog: false,
    showViewModal: false,
  } as OrcamentoPageStates);

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
    value: string | number | boolean | SortingType | Date | undefined
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

  const handleViewOrcamento = (value: Orcamento) => {
    setOrcamento(value);
    changeShowState("showViewModal", true);
  };

  const handleApproveOrcamento = async (orcamento: Orcamento) => {
    try {
      const response = await fetch(`/api/orcamento/${orcamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APROVADO" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao aprovar orçamento");
      }

      toast.success("Orçamento aprovado com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao aprovar orçamento", {
        position: "top-center",
      });
    }
  };

  const handleRejectOrcamento = async (orcamento: Orcamento) => {
    try {
      const response = await fetch(`/api/orcamento/${orcamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJEITADO" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao rejeitar orçamento");
      }

      toast.success("Orçamento rejeitado com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao rejeitar orçamento", {
        position: "top-center",
      });
    }
  };

  const handleGeneratePdfOrcamento = async (orcamento: Orcamento) => {
    try {
      const response = await fetch(`/api/orcamento/${orcamento.id}/pdf`);

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orcamento-${orcamento.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF gerado com sucesso!", {
        position: "top-center",
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar PDF", {
        position: "top-center",
      });
    }
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
    handleViewOrcamento,
    handleEdit,
    handleShowDelete,
    handleApproveOrcamento,
    handleRejectOrcamento,
    handleGeneratePdfOrcamento,
  };
};
