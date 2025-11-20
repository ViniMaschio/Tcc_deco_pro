"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, PencilIcon, TrashIcon, DotsThreeVerticalIcon } from "@phosphor-icons/react";
import { CheckCircle, XCircle, FileDown } from "lucide-react";

import { Orcamento, OrcamentoStatus } from "@/app/api/orcamento/types";
import { Badge } from "@/components/ui/badge";
import { ButtonAction } from "@/components/ui/button-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { twMerge } from "tailwind-merge";
import { formatCurrency } from "@/utils/currency";
import { StatusLabelEnum, StatusColorEnum } from "./enum";

export const orcamentoColumns: ColumnDef<Orcamento>[] = [
  {
    accessorKey: "id",
    header: "Doc",
    cell: ({ row }) => {
      return <span className="font-medium">O{row.getValue("id")}</span>;
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return <span className="font-medium">{cliente?.nome}</span>;
    },
  },
  {
    accessorKey: "local",
    header: "Local",
    cell: ({ row }) => {
      const local = row.original.local;
      return local ? (
        <span>{local.descricao}</span>
      ) : (
        <span className="text-gray-400">Não informado</span>
      );
    },
  },
  {
    accessorKey: "categoriaFesta",
    header: "Categoria",
    cell: ({ row }) => {
      const categoriaFesta = row.original.categoriaFesta;
      return categoriaFesta ? (
        <span>{categoriaFesta.descricao}</span>
      ) : (
        <span className="text-gray-400">Não informado</span>
      );
    },
  },
  {
    accessorKey: "dataEvento",
    header: "Data do Evento",
    cell: ({ row }) => {
      const dataEvento = row.getValue("dataEvento") as Date;
      return dataEvento ? (
        <span>{format(new Date(dataEvento), "dd/MM/yyyy", { locale: ptBR })}</span>
      ) : (
        <span className="text-gray-400">Não informado</span>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return <span className="font-medium">{formatCurrency(total)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrcamentoStatus;
      return (
        <Badge className={twMerge("bg-gray-100 font-bold text-gray-800", StatusColorEnum[status])}>
          {StatusLabelEnum[status]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const orcamento = row.original;

      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-green-500 hover:text-green-500/80"
            variant="outline"
            tooltip="Visualizar"
            onClick={() => {
              const event = new CustomEvent("viewOrcamento", { detail: orcamento });
              window.dispatchEvent(event);
            }}
          >
            <Eye weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => {
              const event = new CustomEvent("editOrcamento", { detail: orcamento });
              window.dispatchEvent(event);
            }}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonAction
                className="h-8 w-8 p-0 text-black hover:text-gray-700"
                variant="outline"
                tooltip="Mais ações"
              >
                <DotsThreeVerticalIcon weight="bold" size={16} />
              </ButtonAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-30">
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("approveOrcamento", { detail: orcamento });
                  window.dispatchEvent(event);
                }}
                className="w-full cursor-pointer"
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Aprovar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("rejectOrcamento", { detail: orcamento });
                  window.dispatchEvent(event);
                }}
                className="cursor-pointer"
              >
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                Rejeitar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("generatePdfOrcamento", { detail: orcamento });
                  window.dispatchEvent(event);
                }}
                className="cursor-pointer"
              >
                <FileDown className="mr-2 h-4 w-4 text-blue-600" />
                Gerar PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("deleteOrcamento", { detail: orcamento });
                  window.dispatchEvent(event);
                }}
                className="cursor-pointer"
                variant="destructive"
              >
                <TrashIcon weight="fill" className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const orcamentoFilterCols = {
  search: {
    name: "search",
    sortName: "search",
    type: "text",
    label: "Buscar",
    sortable: false,
  },
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
    options: [
      { value: "TODOS", label: "Todos os status" },
      { value: "RASCUNHO", label: "Rascunho" },
      { value: "APROVADO", label: "Aprovado" },
      { value: "REJEITADO", label: "Rejeitado" },
    ],
  },
  dataEvento: {
    name: "dataEvento",
    sortName: "dataEvento",
    type: "date",
    label: "Data do Evento",
    sortable: true,
  },
};

type Filters = keyof typeof orcamentoFilterCols;

export type OrcamentoFilterType = {
  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
