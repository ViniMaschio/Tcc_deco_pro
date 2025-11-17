import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Fornecedor } from "@/app/api/fornecedor/types";
import { PaginationTable } from "@/app/api/types";
import { FornecedorFilterType, createColumns } from "@/app/modules/fornecedor/columns";
import { FornecedorPageStates } from "@/app/modules/fornecedor/modal/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [fornecedor, setFornecedor] = useState({} as Fornecedor);

  const [showState, setShowState] = useState({} as FornecedorPageStates);

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
  } as FornecedorFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof FornecedorPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getFornecedor = async (
    filtersParam: FornecedorFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/fornecedor?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Fornecedores!");
    }

    return response.json() as Promise<{
      data: Fornecedor[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["fornecedor", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getFornecedor(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/fornecedor/${fornecedor.id}`, {
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

  const { mutateAsync: removeFornecedor, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteFornecedor"],
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

  const handleEdit = (value: Fornecedor) => {
    setFornecedor(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: Fornecedor) => {
    setFornecedor(value);
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

  const fornecedorData = data?.items || [];

  return {
    data,
    filters,
    fornecedor,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setFornecedor,
    afterSubmit,
    fornecedorData,
    columns,
    removeFornecedor,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  };
};
