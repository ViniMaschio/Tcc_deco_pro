import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { ContaPagar } from "@/app/api/conta-pagar/types";
import { ContaReceber } from "@/app/api/conta-receber/types";
import { ButtonAction } from "@/components/ui/button-action";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyFromCents } from "@/utils/currency";

import { StatusColorEnum, StatusLabelEnum } from "./enum";

interface ContaPagarColumnsProps {
  onEdit: (conta: ContaPagar) => void;
  onDelete: (conta: ContaPagar) => void;
}

interface ContaReceberColumnsProps {
  onEdit: (conta: ContaReceber) => void;
  onDelete: (conta: ContaReceber) => void;
}

export const createContaPagarColumns = ({
  onEdit,
  onDelete,
}: ContaPagarColumnsProps): ColumnDef<ContaPagar>[] => [
  {
    id: "id",
    accessorKey: "id",
    meta: {
      name: "Id",
    },
    header: () => <span>Id</span>,
  },
  {
    id: "fornecedor",
    accessorKey: "fornecedor.nome",
    meta: {
      name: "Fornecedor",
    },
    header: () => <span>Fornecedor</span>,
    cell: ({ row }) => {
      const fornecedor = row.original.fornecedor;
      return <div>{fornecedor?.nome || "-"}</div>;
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
  },
  {
    id: "dataVencimento",
    accessorKey: "dataVencimento",
    meta: {
      name: "Vencimento",
    },
    header: () => <span>Vencimento</span>,
    cell: ({ row }) => {
      const dataVencimento = row.getValue("dataVencimento") as string | Date | undefined;
      return dataVencimento ? (
        <span>{format(new Date(dataVencimento), "dd/MM/yyyy", { locale: ptBR })}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    id: "valorTotal",
    accessorKey: "valorTotal",
    meta: {
      name: "Total",
    },
    header: () => <span>Total</span>,
    cell: ({ row }) => {
      const valorTotal = row.getValue("valorTotal") as number;
      return <span className="font-medium">{formatCurrencyFromCents(valorTotal)}</span>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    meta: {
      name: "Situação",
    },
    header: () => <span>Situação</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof StatusLabelEnum;
      return (
        <Badge className={twMerge("font-bold", StatusColorEnum[status])}>
          {StatusLabelEnum[status]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    meta: {
      name: "Ações",
    },
    header: () => <span>Ações</span>,
    cell: ({ row }) => {
      const conta = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(conta)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(conta)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const createContaReceberColumns = ({
  onEdit,
  onDelete,
}: ContaReceberColumnsProps): ColumnDef<ContaReceber>[] => [
  {
    id: "id",
    accessorKey: "id",
    meta: {
      name: "Id",
    },
    header: () => <span>Id</span>,
  },
  {
    id: "cliente",
    accessorKey: "cliente.nome",
    meta: {
      name: "Cliente",
    },
    header: () => <span>Cliente</span>,
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return <div>{cliente?.nome || "-"}</div>;
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
  },
  {
    id: "dataVencimento",
    accessorKey: "dataVencimento",
    meta: {
      name: "Vencimento",
    },
    header: () => <span>Vencimento</span>,
    cell: ({ row }) => {
      const dataVencimento = row.getValue("dataVencimento") as string | Date | undefined;
      return dataVencimento ? (
        <span>{format(new Date(dataVencimento), "dd/MM/yyyy", { locale: ptBR })}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    id: "valorTotal",
    accessorKey: "valorTotal",
    meta: {
      name: "Total",
    },
    header: () => <span>Total</span>,
    cell: ({ row }) => {
      const valorTotal = row.getValue("valorTotal") as number;
      return <span className="font-medium">{formatCurrencyFromCents(valorTotal)}</span>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    meta: {
      name: "Situação",
    },
    header: () => <span>Situação</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof StatusLabelEnum;
      return (
        <Badge className={twMerge("font-bold", StatusColorEnum[status])}>
          {StatusLabelEnum[status]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    meta: {
      name: "Ações",
    },
    header: () => <span>Ações</span>,
    cell: ({ row }) => {
      const conta = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(conta)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(conta)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const contaPagarFilterCols = {
  fornecedorId: {
    name: "fornecedorId",
    sortName: "fornecedorId",
    type: "number",
    label: "Fornecedor",
    sortable: false,
  },
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
  },
};

export const contaReceberFilterCols = {
  clienteId: {
    name: "clienteId",
    sortName: "clienteId",
    type: "number",
    label: "Cliente",
    sortable: false,
  },
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
  },
};

