import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { CaixaEntrada } from "@/app/api/caixa-entrada/types";
import { CaixaSaida } from "@/app/api/caixa-saida/types";
import { formatCurrencyFromCents } from "@/utils/currency";

const METODOS_LABEL: Record<string, string> = {
  PIX: "PIX",
  DINHEIRO: "Dinheiro",
  CREDITO: "Crédito",
  DEBITO: "Débito",
  BOLETO: "Boleto",
  TED: "TED",
  DOC: "DOC",
  OUTRO: "Outro",
};

export const createCaixaEntradaColumns = (): ColumnDef<CaixaEntrada>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
    cell: ({ row }) => {
      const descricao = row.getValue("descricao") as string | undefined;
      const contaReceber = row.original.contaReceber;
      return <div>{descricao || contaReceber?.descricao || "-"}</div>;
    },
  },
  {
    id: "contaReceber",
    accessorKey: "contaReceber.descricao",
    meta: {
      name: "Conta",
    },
    header: () => <span>Conta a Receber</span>,
    cell: ({ row }) => {
      const contaReceber = row.original.contaReceber;
      return <div>{contaReceber?.descricao || `#${contaReceber?.id || "-"}`}</div>;
    },
  },
  {
    id: "dataRecebimento",
    accessorKey: "dataRecebimento",
    meta: {
      name: "Data",
    },
    header: () => <span>Data de Recebimento</span>,
    cell: ({ row }) => {
      const dataRecebimento = row.getValue("dataRecebimento") as string | Date | undefined;
      return dataRecebimento ? (
        <span>{format(new Date(dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    id: "valor",
    accessorKey: "valor",
    meta: {
      name: "Valor",
    },
    header: () => <span>Valor</span>,
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number;
      return <span className="font-medium text-green-600">{formatCurrencyFromCents(valor)}</span>;
    },
  },
  {
    id: "metodo",
    accessorKey: "metodo",
    meta: {
      name: "Método",
    },
    header: () => <span>Método</span>,
    cell: ({ row }) => {
      const metodo = row.getValue("metodo") as string;
      return <span>{METODOS_LABEL[metodo] || metodo}</span>;
    },
  },
];

export const createCaixaSaidaColumns = (): ColumnDef<CaixaSaida>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
    cell: ({ row }) => {
      const descricao = row.getValue("descricao") as string | undefined;
      const contaPagar = row.original.contaPagar;
      return <div>{descricao || contaPagar?.descricao || "-"}</div>;
    },
  },
  {
    id: "contaPagar",
    accessorKey: "contaPagar.descricao",
    meta: {
      name: "Conta",
    },
    header: () => <span>Conta a Pagar</span>,
    cell: ({ row }) => {
      const contaPagar = row.original.contaPagar;
      return <div>{contaPagar?.descricao || `#${contaPagar?.id || "-"}`}</div>;
    },
  },
  {
    id: "fornecedor",
    accessorKey: "contaPagar.fornecedor.nome",
    meta: {
      name: "Fornecedor",
    },
    header: () => <span>Fornecedor</span>,
    cell: ({ row }) => {
      const fornecedor = row.original.contaPagar?.fornecedor;
      return <div>{fornecedor?.nome || "-"}</div>;
    },
  },
  {
    id: "dataPagamento",
    accessorKey: "dataPagamento",
    meta: {
      name: "Data",
    },
    header: () => <span>Data de Pagamento</span>,
    cell: ({ row }) => {
      const dataPagamento = row.getValue("dataPagamento") as string | Date | undefined;
      return dataPagamento ? (
        <span>{format(new Date(dataPagamento), "dd/MM/yyyy", { locale: ptBR })}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    id: "valor",
    accessorKey: "valor",
    meta: {
      name: "Valor",
    },
    header: () => <span>Valor</span>,
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number;
      return <span className="font-medium text-red-600">{formatCurrencyFromCents(valor)}</span>;
    },
  },
  {
    id: "metodo",
    accessorKey: "metodo",
    meta: {
      name: "Método",
    },
    header: () => <span>Método</span>,
    cell: ({ row }) => {
      const metodo = row.getValue("metodo") as string;
      return <span>{METODOS_LABEL[metodo] || metodo}</span>;
    },
  },
];
