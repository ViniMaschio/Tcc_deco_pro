import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Contrato } from "@/app/api/contrato/types";
import { PaginationTable } from "@/app/api/types";
import { contratoColumns, ContratoFilterType } from "@/app/modules/contrato/columns";
import { ContratoPageStates } from "@/app/modules/contrato/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [contrato, setContrato] = useState({} as Contrato);

  const [showState, setShowState] = useState({
    showModal: false,
    showDialog: false,
    showViewModal: false,
  } as ContratoPageStates);

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
  } as ContratoFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof ContratoPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getContrato = async (
    filtersParam: ContratoFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/contrato?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Contratos!");
    }

    return response.json() as Promise<{
      data: Contrato[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["contrato", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getContrato(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/contrato/${contrato.id}`, {
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

  const { mutateAsync: removeContrato, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteContrato"],
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

  const handleEdit = (value: Contrato) => {
    setContrato(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: Contrato) => {
    setContrato(value);
    changeShowState("showDialog", true);
  };

  const handleViewContrato = (value: Contrato) => {
    setContrato(value);
    changeShowState("showViewModal", true);
  };

  const handleApproveContrato = async (contrato: Contrato) => {
    try {
      await fetch(`/api/contrato/${contrato.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });

      toast.success("Contrato aprovado com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao aprovar contrato", {
        position: "top-center",
      });
    }
  };

  const handleCancelContrato = async (contrato: Contrato) => {
    try {
      await fetch(`/api/contrato/${contrato.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELADO" }),
      });

      toast.success("Contrato cancelado com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cancelar contrato", {
        position: "top-center",
      });
    }
  };

  const handleConcludeContrato = async (contrato: Contrato) => {
    try {
      await fetch(`/api/contrato/${contrato.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONCLUIDO" }),
      });

      toast.success("Contrato concluído com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao concluir contrato", {
        position: "top-center",
      });
    }
  };

  const handleGeneratePdfContrato = async (contrato: Contrato) => {
    try {
      const response = await fetch(`/api/contrato/${contrato.id}/pdf`);

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-${contrato.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF gerado com sucesso!", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF", {
        position: "top-center",
      });
    }
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    refetch();
  };

  const columns = contratoColumns;

  const contratoData = data?.items || [];

  return {
    data,
    filters,
    contrato,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setContrato,
    afterSubmit,
    contratoData,
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
  };
};
