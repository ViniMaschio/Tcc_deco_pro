import { PencilIcon, TrashIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { ContaPagar } from "@/app/api/conta-pagar/types";
import { ContaReceber } from "@/app/api/conta-receber/types";
import { ButtonAction } from "@/components/ui/button-action";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyFromCents } from "@/utils/currency";

import { StatusColorEnum, getStatusLabel } from "./enum";

interface ContaPagarColumnsProps {
  onEdit: (conta: ContaPagar) => void;
  onDelete: (conta: ContaPagar) => void;
  onPay?: (conta: ContaPagar) => void;
}

interface ContaReceberColumnsProps {
  onEdit: (conta: ContaReceber) => void;
  onDelete: (conta: ContaReceber) => void;
  onReceive?: (conta: ContaReceber) => void;
}

export const createContaPagarColumns = ({
  onEdit,
  onDelete,
  onPay,
}: ContaPagarColumnsProps): ColumnDef<ContaPagar>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
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
      const status = row.getValue("status") as "PENDENTE" | "FINALIZADO";
      return (
        <Badge className={twMerge("font-bold", StatusColorEnum[status])}>
          {getStatusLabel(status, "pagar")}
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
          {onPay && conta.status === "PENDENTE" && (
            <ButtonAction
              className="h-8 w-8 p-0 text-green-500 hover:text-green-500/80"
              variant="outline"
              tooltip="Pagar"
              onClick={() => onPay(conta)}
            >
              <CheckCircleIcon weight="fill" size={16} />
            </ButtonAction>
          )}
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
  onReceive,
}: ContaReceberColumnsProps): ColumnDef<ContaReceber>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
  },
  {
    id: "contrato",
    accessorKey: "contrato.id",
    meta: {
      name: "Contrato",
    },
    header: () => <span>Contrato</span>,
    cell: ({ row }) => {
      const contrato = row.original.contrato;
      return <div>{contrato?.id ? `C${contrato.id}` : "-"}</div>;
    },
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
      const status = row.getValue("status") as "PENDENTE" | "FINALIZADO";
      return (
        <Badge className={twMerge("font-bold", StatusColorEnum[status])}>
          {getStatusLabel(status, "receber")}
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
          {onReceive && conta.status === "PENDENTE" && (
            <ButtonAction
              className="h-8 w-8 p-0 text-green-500 hover:text-green-500/80"
              variant="outline"
              tooltip="Receber"
              onClick={() => onReceive(conta)}
            >
              <CheckCircleIcon weight="fill" size={16} />
            </ButtonAction>
          )}
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
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
  },
};
