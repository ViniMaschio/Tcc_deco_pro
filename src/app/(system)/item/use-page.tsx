import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Item } from "@/app/api/item/types";
import { PaginationTable } from "@/app/api/types";
import { createColumns, ItemFilterType } from "@/app/modules/item/columns";
import { ItemPageStates } from "@/app/modules/item/modal/types";
import { SortingType } from "@/components/sort-table";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [item, setItem] = useState({} as Item);

  const [showState, setShowState] = useState({} as ItemPageStates);

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
  } as ItemFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const changeShowState = (name: keyof ItemPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getItems = async (
    filtersParam: ItemFilterType,
    paginationParam: PaginationTable,
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/item?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar itens!");
    }

    return response.json() as Promise<{
      data: Item[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["item", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getItems(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
  });

  const handleDelete = async () => {
    try {
      await fetch(`/api/item/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      changeShowState("showDialog", false);
      toast.success("Item excluído com sucesso!", {
        position: "top-center",
      });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir item", {
        position: "top-center",
      });
    }
  };

  const { mutateAsync: removeItem, isPending: isDeleting } = useMutation({
    mutationFn: handleDelete,
    mutationKey: ["deleteItem"],
  });

  const handleChangeFilters = (
    name: string,
    value: string | number | boolean | SortingType | undefined,
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
      nome: "",
      descricao: "",
    }));
  };

  const handleEdit = (value: Item) => {
    setItem(value);
    changeShowState("showModal", true);
  };

  const handleShowDelete = (value: Item) => {
    setItem(value);
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

  const itemData = data?.items || [];

  return {
    data,
    filters,
    item,
    showState,
    isLoading: isLoading || isFetching,
    pagination,
    isDeleting,
    setItem,
    afterSubmit,
    itemData,
    columns,
    removeItem,
    changeShowState,
    changePagination,
    handleClearFilters,
    handleChangeFilters,
  };
};
