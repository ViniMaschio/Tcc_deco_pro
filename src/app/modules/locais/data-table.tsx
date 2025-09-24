import { CircleNotchIcon } from "@phosphor-icons/react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  type Table as StackTable,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Local } from "@/app/api/local/types";
import { PaginationTable } from "@/app/api/types";
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

import { localFilterCols, LocalFilterType } from "./columns";

interface DataTableProps {
  columns: ColumnDef<Local>[];
  data: Local[];
  pagination: PaginationTable;
  setPagination: (pagination: PaginationTable) => void;
  handleEdit: (value: Local) => void;
  setDataTable?: (value: StackTable<Local>) => void;
  changeFilters: (
    name: string,
    value: string | SortingType | undefined,
  ) => void;
  filters: LocalFilterType;
  clearFilters: () => void;
  isLoading: boolean;
}

export function LocalDataTable({
  columns,
  data,
  pagination,
  setPagination,
  changeFilters,
  clearFilters,
  setDataTable,
  filters,
  handleEdit,
  isLoading,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
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
                          {Object.keys(localFilterCols).includes(header.id) ? (
                            <>
                              {localFilterCols[
                                header.id as keyof typeof localFilterCols
                              ].sortable ? (
                                <SortTable
                                  filters={filters}
                                  name={
                                    localFilterCols[
                                      header.id as keyof typeof localFilterCols
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
                    // onDoubleClick={() => handleEdit(data[row.index])}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={twMerge(
                      row.index % 2 ? "bg-[#f8fafc]" : "bg-auto",
                    )}
                  >
                    {/* {table.getAllColumns().filter((c) => c.getCanHide())
                      .length !== cookies.get<string[]>(cookieName).length ? (
                      <TableCell
                        className={twMerge(
                          "w-12",
                          row.index % 2 ? "bg-[#f8fafc]" : "bg-white",
                          row.getIsSelected() &&
                            "bg-primary-main-extra-light-light",
                          "transition-all duration-500",
                        )}
                      />
                    ) : undefined} */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={twMerge(
                          cell.column.id === "actions" &&
                            "sticky right-0 z-[1] w-32",
                          row.index % 2 ? "bg-[#f8fafc]" : "bg-white",
                          row.getIsSelected() &&
                            "bg-primary-main-extra-light-light",
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
    </>
  );
}
