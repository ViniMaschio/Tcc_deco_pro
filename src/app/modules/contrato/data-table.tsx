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
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { Contrato } from "@/app/api/contrato/types";
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

import { contratoFilterCols, ContratoFilterType } from "./columns";
import { ContratoPageStates } from "./types";

interface DataTableProps {
  columns: ColumnDef<Contrato>[];
  data: Contrato[];
  pagination: PaginationTable;
  setPagination: (pagination: PaginationTable) => void;
  changeFilters: (name: string, value: string | SortingType | undefined) => void;
  filters: ContratoFilterType;
  clearFilters: () => void;
  isLoading: boolean;
  showState: ContratoPageStates;
  changeShowState: (name: keyof ContratoPageStates, value: boolean) => void;
  removeContrato: () => void;
  isDeleting: boolean;
  onViewContrato?: (contrato: Contrato) => void;
  onEditContrato?: (contrato: Contrato) => void;
  onDeleteContrato?: (contrato: Contrato) => void;
  onApproveContrato?: (contrato: Contrato) => void;
  onCancelContrato?: (contrato: Contrato) => void;
  onConcludeContrato?: (contrato: Contrato) => void;
  onGeneratePdfContrato?: (contrato: Contrato) => void;
}

export function ContratoDataTable({
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
  removeContrato,
  onViewContrato,
  onEditContrato,
  onDeleteContrato,
  onApproveContrato,
  onCancelContrato,
  onConcludeContrato,
  onGeneratePdfContrato,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const handleViewContrato = (event: CustomEvent) => {
      onViewContrato?.(event.detail);
    };

    const handleEditContrato = (event: CustomEvent) => {
      onEditContrato?.(event.detail);
    };

    const handleDeleteContrato = (event: CustomEvent) => {
      onDeleteContrato?.(event.detail);
    };

    const handleApproveContrato = (event: CustomEvent) => {
      onApproveContrato?.(event.detail);
    };

    const handleCancelContrato = (event: CustomEvent) => {
      onCancelContrato?.(event.detail);
    };

    const handleConcludeContrato = (event: CustomEvent) => {
      onConcludeContrato?.(event.detail);
    };

    const handleGeneratePdfContrato = (event: CustomEvent) => {
      onGeneratePdfContrato?.(event.detail);
    };

    window.addEventListener("viewContrato", handleViewContrato as EventListener);
    window.addEventListener("editContrato", handleEditContrato as EventListener);
    window.addEventListener("deleteContrato", handleDeleteContrato as EventListener);
    window.addEventListener("approveContrato", handleApproveContrato as EventListener);
    window.addEventListener("cancelContrato", handleCancelContrato as EventListener);
    window.addEventListener("concludeContrato", handleConcludeContrato as EventListener);
    window.addEventListener("generatePdfContrato", handleGeneratePdfContrato as EventListener);

    return () => {
      window.removeEventListener("viewContrato", handleViewContrato as EventListener);
      window.removeEventListener("editContrato", handleEditContrato as EventListener);
      window.removeEventListener("deleteContrato", handleDeleteContrato as EventListener);
      window.removeEventListener("approveContrato", handleApproveContrato as EventListener);
      window.removeEventListener("cancelContrato", handleCancelContrato as EventListener);
      window.removeEventListener("concludeContrato", handleConcludeContrato as EventListener);
      window.removeEventListener("generatePdfContrato", handleGeneratePdfContrato as EventListener);
    };
  }, [
    onViewContrato,
    onEditContrato,
    onDeleteContrato,
    onApproveContrato,
    onCancelContrato,
    onConcludeContrato,
    onGeneratePdfContrato,
  ]);

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
                          {Object.keys(contratoFilterCols).includes(header.id) ? (
                            <>
                              {contratoFilterCols[header.id as keyof typeof contratoFilterCols]
                                .sortable ? (
                                <SortTable
                                  filters={filters}
                                  name={
                                    contratoFilterCols[header.id as keyof typeof contratoFilterCols]
                                      .sortName
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
                          cell.column.id === "actions" && "sticky right-0 z-1 w-32",
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
          onConfirm={removeContrato}
          isLoading={isDeleting}
        />
      ) : null}
    </>
  );
}
