import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { CategoriaFesta } from "@/app/api/categoria-festa/types";
import { PaginationTable } from "@/app/api/types";
import { CategoriaFestaFilterType, createColumns } from "@/app/modules/categoria-festa/columns";
import { CategoriaFestaPageStates } from "@/app/modules/categoria-festa/modal/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [categoriaFesta, setCategoriaFesta] = useState({} as CategoriaFesta);

  const [showState, setShowState] = useState({} as CategoriaFestaPageStates);

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
  } as CategoriaFestaFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof CategoriaFestaPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getCategoriaFesta = async (
    filtersParam: CategoriaFestaFilterType,
    paginationParam: PaginationTable
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/categoria-festa?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar Categorias de Festa!");
    }

    return response.json() as Promise<{
      data: CategoriaFesta[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["categoria-festa", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getCategoriaFesta(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/categoria-festa/${categoriaFesta.id}`, {
        method: "DELETE",
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

  const { mutateAsync: removeCategoriaFesta, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteCategoriaFesta"],
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
      descricao: "",
    }));
  };

  const handleEdit = (value: CategoriaFesta) => {
    setCategoriaFesta(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: CategoriaFesta) => {
    setCategoriaFesta(value);
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

  const categoriaFestaData = data?.items || [];

  return {
    data,
    filters,
    categoriaFesta,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setCategoriaFesta,
    afterSubmit,
    categoriaFestaData,
    columns,
    removeCategoriaFesta,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  };
};
