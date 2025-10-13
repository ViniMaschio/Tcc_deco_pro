import { CircleNotchIcon, TrashIcon } from "@phosphor-icons/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Cliente } from "@/app/api/cliente/types";
import { PaginationTable } from "@/app/api/types";
import { SortingType, SortTable } from "@/components/sort-table";
import { TablePagination } from "@/components/TablePagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { clienteFilterCols, ClienteFilterType } from "./columns";
import { ClientePageStates } from "./modal/types";

interface DataTableProps {
  columns: ColumnDef<Cliente>[];
  data: Cliente[];
  pagination: PaginationTable;
  setPagination: (pagination: PaginationTable) => void;
  changeFilters: (
    name: string,
    value: string | SortingType | undefined,
  ) => void;
  filters: ClienteFilterType;
  clearFilters: () => void;
  isLoading: boolean;
  showState: ClientePageStates;
  changeShowState: (name: keyof ClientePageStates, value: boolean) => void;
  removeCliente: () => void;
  isDeleting: boolean;
}

export function ClienteDataTable({
  columns,
  data,
  pagination,
  setPagination,
  changeFilters,
  filters,
  isLoading,
  showState,
  changeShowState,
  isDeleting,
  removeCliente,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="relative h-auto max-h-full overflow-auto bg-white transition-all duration-1000 ease-in-out">
        <Table className="h-auto max-h-full transition-all duration-100 ease-in-out">
          <TableHeader className="sticky top-0 z-20 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={twMerge(
                        header.column.id === "actions" &&
                          "sticky top-0 right-0 z-10 bg-white",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        <div className="flex items-center">
                          {Object.keys(clienteFilterCols).includes(header.id) ? (
                            <>
                              {clienteFilterCols[
                                header.id as keyof typeof clienteFilterCols
                              ].sortable ? (
                                <SortTable
                                  filters={filters}
                                  name={
                                    clienteFilterCols[
                                      header.id as keyof typeof clienteFilterCols
                                    ].sortName
                                  }
                                  changeFilter={changeFilters}
                                />
                              ) : undefined}
                            </>
                          ) : undefined}
                        </div>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="z-10 transition-all duration-200 ease-linear">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  <div className="flex w-full flex-col items-center justify-center">
                    <CircleNotchIcon size={28} className="animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    className={twMerge(
                      row.index % 2 ? "bg-[#f8fafc]" : "bg-auto",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={twMerge(
                          cell.column.id === "actions" &&
                            "sticky right-0 z-[1] w-32",
                          row.index % 2 ? "bg-[#f8fafc]" : "bg-white",
                          "transition-all duration-500",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination pagination={pagination} setPagination={setPagination} />

      <AlertDialog open={showState.showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-col items-center justify-center text-center">
              <TrashIcon size={64} className="text-gray-800" />
              Tem certeza de que deseja excluir este registro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Essa ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => changeShowState("showDialog", false)}
              className="w-full cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full cursor-pointer bg-red-500 text-white hover:bg-red-500/80"
              isLoading={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                removeCliente();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
