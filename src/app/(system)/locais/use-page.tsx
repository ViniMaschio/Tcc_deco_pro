"use client";

import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Local } from "@/app/api/local/types";
import { PaginationTable } from "@/app/api/types";
import { LocalFilterType } from "@/app/modules/locais/columns";
import { LocalPageStates } from "@/app/modules/locais/modal/types";
import { SortingType } from "@/components/sort-table";
import { ButtonAction } from "@/components/ui/button-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildQueryStringFrom } from "@/utils/functions/quey-functions";

export const usePage = () => {
  const [dataTable, setDataTable] = useState<Table<Local>>();
  const [localData, setLocalData] = useState<Local[]>();

  const [showState, setShowState] = useState({} as LocalPageStates);

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
  } as LocalFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
    }));
  };

  const getLocais = async (
    filtersParam: LocalFilterType,
    paginationParam: PaginationTable,
  ) => {
    const queryString = buildQueryStringFrom(filtersParam, paginationParam);

    const response = await fetch(`/api/local?${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar locais");
    }

    return response.json() as Promise<{
      data: Local[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["locais", filters, pagination.currentPage, pagination.perPage],
    queryFn: () => getLocais(filters, pagination),
    select: (res) => ({
      items: res.data,
      meta: res.pagination,
    }),
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
      descricao: "",
      cep: "",
      cidade: "",
    }));
  };

  const handleEdit = () => {};

  const changeShowState = (name: keyof LocalPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    refetch();
  };

  const extraColumns: ColumnDef<Local>[] = [
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <ButtonAction
              className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
              variant={"outline"}
              tooltip="Editar"
              //   onClick={() => handleEdit(row.original)}
            >
              <PencilIcon weight="fill" size={16} />
            </ButtonAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ButtonAction
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
                  variant={"outline"}
                  tooltip="Excluir"
                >
                  <TrashIcon weight="fill" size={16} />
                </ButtonAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onClick={(e) => e.preventDefault()}
                className="relative bg-white p-1 focus:bg-white"
              >
                <DropdownMenuItem
                  // onClick={() => handleDelete(row.original.id)}
                  className="flex cursor-pointer items-center justify-center gap-2 focus:bg-white"
                >
                  Confirmar
                  <Check size={16} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (!data) return;

    setLocalData(data.items);

    setPagination((prev) => ({
      ...prev,
      count: data.meta.total,
      pagesCount: data.meta.totalPages,
    }));
  }, [data]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [filters]);

  return {
    extraColumns,
    pagination,
    changePagination,
    handleChangeFilters,
    handleClearFilters,
    setDataTable,
    filters,
    setFilters,
    handleEdit,
    changeShowState,
    showState,
    afterSubmit,
    localData,
    isLoading: isLoading || isFetching,
  };
};
