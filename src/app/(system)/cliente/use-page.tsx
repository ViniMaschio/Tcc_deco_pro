import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Cliente } from "@/app/api/cliente/types";
import { PaginationTable } from "@/app/api/types";
import { ClienteFilterType, createColumns } from "@/app/modules/cliente/columns";
import { ClientePageStates } from "@/app/modules/cliente/modal/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [cliente, setCliente] = useState({} as Cliente);

  const [showState, setShowState] = useState({} as ClientePageStates);

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
  } as ClienteFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof ClientePageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getCliente = async (filtersParam: ClienteFilterType, paginationParam: PaginationTable) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/cliente?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Clientes!");
    }

    return response.json() as Promise<{
      data: Cliente[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["cliente", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getCliente(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/cliente/${cliente.id}`, {
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

  const { mutateAsync: removeCliente, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteCliente"],
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
    else if (name === "cep") {
      setFilters((filters) => ({
        ...filters,
        cep: value.toString().replace("-", ""),
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
      nome: "",
      cep: "",
      cidade: "",
    }));
  };

  const handleEdit = (value: Cliente) => {
    setCliente(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: Cliente) => {
    setCliente(value);
    changeShowState("showDialog", true);
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    refetch();
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleShowDelete,
  });

  const clienteData = data?.items || [];

  return {
    data,
    filters,
    cliente,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setCliente,
    afterSubmit,
    clienteData,
    columns,
    removeCliente,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  };
};
