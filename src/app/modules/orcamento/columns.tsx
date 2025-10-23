"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, PencilIcon, TrashIcon } from "@phosphor-icons/react";

import { Orcamento } from "@/app/api/orcamento/types";
import { Badge } from "@/components/ui/badge";
import { ButtonAction } from "@/components/ui/button-action";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "RASCUNHO":
      return "bg-gray-100 text-gray-800";
    case "ENVIADO":
      return "bg-blue-100 text-blue-800";
    case "APROVADO":
      return "bg-green-100 text-green-800";
    case "REJEITADO":
      return "bg-red-100 text-red-800";
    case "VENCIDO":
      return "bg-orange-100 text-orange-800";
    case "CANCELADO":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho";
    case "ENVIADO":
      return "Enviado";
    case "APROVADO":
      return "Aprovado";
    case "REJEITADO":
      return "Rejeitado";
    case "VENCIDO":
      return "Vencido";
    case "CANCELADO":
      return "Cancelado";
    default:
      return status;
  }
};

export const orcamentoColumns: ColumnDef<Orcamento>[] = [
  {
    accessorKey: "id",
    header: "Doc",
    cell: ({ row }) => {
      return <span className="font-medium">C{row.getValue("id")}</span>;
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return (
        <div>
          <div className="font-medium">{cliente?.nome}</div>
          {cliente?.telefone && <div className="text-sm text-gray-500">{cliente.telefone}</div>}
        </div>
      );
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
      const status = row.getValue("status") as string;
      return <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>;
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
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => {
              const event = new CustomEvent("deleteOrcamento", { detail: orcamento });
              window.dispatchEvent(event);
            }}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
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
      { value: "ENVIADO", label: "Enviado" },
      { value: "APROVADO", label: "Aprovado" },
      { value: "REJEITADO", label: "Rejeitado" },
      { value: "VENCIDO", label: "Vencido" },
      { value: "CANCELADO", label: "Cancelado" },
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
