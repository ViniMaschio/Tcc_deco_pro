import { PencilIcon, TrashIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";

import { ContaPagar } from "@/app/api/conta-pagar/types";
import { ContaReceber } from "@/app/api/conta-receber/types";
import { ButtonAction } from "@/components/ui/button-action";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyFromCents } from "@/utils/currency";
import { formatDate } from "@/utils/date";

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
      const formattedDate = formatDate(dataVencimento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
      );
    },
  },
  {
    id: "dataPagamento",
    accessorKey: "dataPagamento",
    meta: {
      name: "Pagamento",
    },
    header: () => <span>Pagamento</span>,
    cell: ({ row }) => {
      const dataPagamento = row.getValue("dataPagamento") as string | Date | undefined;
      const formattedDate = formatDate(dataPagamento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
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
      const isFinalizado = conta.status === "FINALIZADO";
      return (
        <div className="flex items-center gap-1">
          {onPay && (
            <ButtonAction
              className={twMerge(
                "h-8 w-8 p-0 text-green-500 hover:text-green-500/80",
                isFinalizado && "text-gray-400"
              )}
              variant="outline"
              tooltip="Pagar"
              onClick={() => onPay(conta)}
              disabled={isFinalizado}
            >
              <CheckCircleIcon weight="fill" size={16} />
            </ButtonAction>
          )}
          <ButtonAction
            className={twMerge(
              "h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80",
              isFinalizado && "text-gray-400"
            )}
            variant="outline"
            tooltip="Editar"
            disabled={isFinalizado}
            onClick={() => onEdit(conta)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className={twMerge(
              "h-8 w-8 p-0 text-red-500 hover:text-red-500/80",
              isFinalizado && "text-gray-400"
            )}
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(conta)}
            disabled={isFinalizado}
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
      const formattedDate = formatDate(dataVencimento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
      );
    },
  },
  {
    id: "dataPagamento",
    accessorKey: "dataPagamento",
    meta: {
      name: "Recebimento",
    },
    header: () => <span>Recebimento</span>,
    cell: ({ row }) => {
      const dataPagamento = row.getValue("dataPagamento") as string | Date | undefined;
      const formattedDate = formatDate(dataPagamento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
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
      const isFinalizado = conta.status === "FINALIZADO";
      return (
        <div className="flex items-center gap-1">
          {onReceive && (
            <ButtonAction
              className={twMerge(
                "h-8 w-8 p-0 text-green-500 hover:text-green-500/80",
                isFinalizado && "text-gray-400"
              )}
              variant="outline"
              tooltip="Receber"
              onClick={() => onReceive(conta)}
              disabled={isFinalizado}
            >
              <CheckCircleIcon weight="fill" size={16} />
            </ButtonAction>
          )}
          <ButtonAction
            className={twMerge(
              "h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80",
              isFinalizado && "text-gray-400"
            )}
            variant="outline"
            tooltip="Editar"
            disabled={isFinalizado}
            onClick={() => onEdit(conta)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className={twMerge(
              "h-8 w-8 p-0 text-red-500 hover:text-red-500/80",
              isFinalizado && "text-gray-400"
            )}
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(conta)}
            disabled={isFinalizado}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const contaPagarFilterCols = {
  descricao: {
    name: "descricao",
    sortName: "descricao",
    type: "text",
    label: "Descrição",
    sortable: true,
  },
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
    fields: [
      { value: "TODOS", label: "Todos" },
      { value: "PENDENTE", label: "Pendente" },
      { value: "FINALIZADO", label: "Pago" },
    ],
  },
};

export const contaReceberFilterCols = {
  descricao: {
    name: "descricao",
    sortName: "descricao",
    type: "text",
    label: "Descrição",
    sortable: true,
  },
  status: {
    name: "status",
    sortName: "status",
    type: "select",
    label: "Status",
    sortable: true,
    fields: [
      { value: "TODOS", label: "Todos" },
      { value: "PENDENTE", label: "Pendente" },
      { value: "FINALIZADO", label: "Recebido" },
    ],
  },
  dataInicio: {
    name: "dataInicio",
    type: "date",
    label: "Data Inicial",
  },
  dataFim: {
    name: "dataFim",
    type: "date",
    label: "Data Final",
  },
};

export const contaPagarFilterColsWithDates = {
  ...contaPagarFilterCols,
  dataInicio: {
    name: "dataInicio",
    type: "date",
    label: "Data Inicial",
  },
  dataFim: {
    name: "dataFim",
    type: "date",
    label: "Data Final",
  },
};

export const contaReceberFilterColsWithDates = {
  ...contaReceberFilterCols,
};
