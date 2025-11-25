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

import { PaginationTable } from "@/app/api/types";
import { TablePagination } from "@/components/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FluxoCaixaDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination: PaginationTable;
  setPagination: (pagination: PaginationTable) => void;
  isLoading: boolean;
}

export function FluxoCaixaDataTable<T extends { id: number | string }>({
  columns,
  data,
  pagination,
  setPagination,
  isLoading,
}: FluxoCaixaDataTableProps<T>) {
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
                    <TableHead key={header.id}>
                      <div className="flex items-center gap-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
    </>
  );
}
