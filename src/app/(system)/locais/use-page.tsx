"use client";

import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Local } from "@/app/api/local/types";
import { PaginationTable } from "@/app/api/types";
import { LocalFilterType } from "@/app/modules/locais/columns";
import { LocalPageStates } from "@/app/modules/locais/modal/types";
import { ButtonAction } from "@/components/ui/button-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePaginationStore } from "@/store/pagination";

export const usePage = () => {
  const [dataTable, setDataTable] = useState<Table<Local>>();
  const [localData, setLocalData] = useState<Local[]>();

  const [showState, setShowState] = useState({} as LocalPageStates);

  const perPage = usePaginationStore((state) => state.perPage);

  const [pagination, setPagination] = useState({
    perPage,
    update: false,
    currentPage: 1,
    count: 0,
    pagesCount: 1,
  } as PaginationTable);

  const [filters, setFilters] = useState({
    sorting: {
      name: "name",
      type: "asc",
    },
  } as LocalFilterType);

  const changePagination = (pagination: PaginationTable) => {
    setPagination((previous) => ({
      ...previous,
      ...pagination,
      update: !previous.update,
    }));
  };

  const getLocais = async () => {
    changeShowState("isLoading", true);
    const response = await fetch("api/local", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      response.json().then((items) => {
        setLocalData(items);
      });
    } else {
      console.error("Occorreu um erro ao buscar os locais!");
    }

    changeShowState("isLoading", false);
  };

  const handleChangeFilters = () => {};

  const handleClearFilters = () => {};

  const handleEdit = () => {};

  const changeShowState = (name: keyof LocalPageStates, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const afterSubmit = () => {
    changeShowState("showModal", false);
    getLocais();
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
    getLocais();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Number(localData?.length) > 0) {
      setPagination((pagination) => ({
        ...pagination,
        count: Number(localData?.length),
      }));
    }
  }, [localData]);

  return {
    extraColumns,
    pagination,
    setPagination,
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
  };
};
