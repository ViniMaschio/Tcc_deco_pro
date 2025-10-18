import { CircleNotchIcon } from "@phosphor-icons/react";
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

import { Orcamento } from "@/app/api/orcamento/types";
import { PaginationTable } from "@/app/api/types";
import { DeleteConfirmationDialog } from "@/components/delete-dialog";
import { SortingType, SortTable } from "@/components/sort-table";
import { TablePagination } from "@/components/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { orcamentoFilterCols, OrcamentoFilterType } from "./columns";
import { OrcamentoPageStates } from "./types";

interface DataTableProps {
  columns: ColumnDef<Orcamento>[];
  data: Orcamento[];
  pagination: PaginationTable;
  setPagination: (pagination: PaginationTable) => void;
  changeFilters: (name: string, value: string | SortingType | undefined) => void;
  filters: OrcamentoFilterType;
  clearFilters: () => void;
  isLoading: boolean;
  showState: OrcamentoPageStates;
  changeShowState: (name: keyof OrcamentoPageStates, value: boolean) => void;
  removeOrcamento: () => void;
  isDeleting: boolean;
}

export function OrcamentoDataTable({
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
  removeOrcamento,
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
                        header.column.id === "actions" && "sticky top-0 right-0 z-10 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        <div className="flex items-center">
                          {Object.keys(orcamentoFilterCols).includes(header.id) ? (
                            <>
                              {orcamentoFilterCols[header.id as keyof typeof orcamentoFilterCols]
                                .sortable ? (
                                <SortTable
                                  filters={filters}
                                  name={
                                    orcamentoFilterCols[
                                      header.id as keyof typeof orcamentoFilterCols
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
                <TableCell colSpan={columns.length} className="h-12 text-center">
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
                    className={twMerge(row.index % 2 ? "bg-[#f8fafc]" : "bg-auto")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={twMerge(
                          cell.column.id === "actions" && "sticky right-0 z-[1] w-32",
                          row.index % 2 ? "bg-[#f8fafc]" : "bg-white",
                          "transition-all duration-500"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination pagination={pagination} setPagination={setPagination} />

      {showState.showDialog ? (
        <DeleteConfirmationDialog
          open={showState.showDialog}
          onOpenChange={(open) => changeShowState("showDialog", open)}
          onConfirm={removeOrcamento}
          isLoading={isDeleting}
        />
      ) : null}
    </>
  );
}
