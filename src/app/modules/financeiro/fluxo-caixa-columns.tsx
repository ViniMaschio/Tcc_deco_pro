import { TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import { CaixaEntrada } from "@/app/api/caixa-entrada/types";
import { CaixaSaida } from "@/app/api/caixa-saida/types";
import { ButtonAction } from "@/components/ui/button-action";
import { formatCurrencyFromCents } from "@/utils/currency";
import { formatDate } from "@/utils/date";

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

interface FluxoCaixaColumnsProps {
  onDelete?: (item: CaixaEntrada | CaixaSaida) => void;
}

export const createCaixaEntradaColumns = (
  props?: FluxoCaixaColumnsProps
): ColumnDef<CaixaEntrada>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
    cell: ({ row }) => {
      const descricao = row.getValue("descricao") as string | undefined;
      return <div>{descricao || "-"}</div>;
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
      const formattedDate = formatDate(dataRecebimento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
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
  ...(props?.onDelete
    ? [
        {
          id: "actions",
          meta: {
            name: "Ações",
          },
          header: () => {
            return (
              <div className="flex justify-end">
                <span>Ações</span>
              </div>
            );
          },
          cell: ({ row }) => {
            const item = row.original;
            return (
              <div className="flex items-center justify-end gap-1">
                <ButtonAction
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
                  variant="outline"
                  tooltip="Excluir"
                  onClick={() => props.onDelete?.(item)}
                >
                  <TrashIcon weight="fill" size={16} />
                </ButtonAction>
              </div>
            );
          },
        } as ColumnDef<CaixaEntrada>,
      ]
    : []),
];

export const createCaixaSaidaColumns = (
  props?: FluxoCaixaColumnsProps
): ColumnDef<CaixaSaida>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => <span>Descrição</span>,
    cell: ({ row }) => {
      const descricao = row.getValue("descricao") as string | undefined;
      return <div>{descricao || "-"}</div>;
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
      const formattedDate = formatDate(dataPagamento);
      return formattedDate === "-" ? (
        <span className="text-gray-400">-</span>
      ) : (
        <span>{formattedDate}</span>
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
  ...(props?.onDelete
    ? [
        {
          id: "actions",
          meta: {
            name: "Ações",
          },
          header: () => {
            return (
              <div className="flex justify-end">
                <span>Ações</span>
              </div>
            );
          },
          cell: ({ row }) => {
            const item = row.original;
            return (
              <div className="flex items-center justify-end gap-1">
                <ButtonAction
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
                  variant="outline"
                  tooltip="Excluir"
                  onClick={() => props.onDelete?.(item)}
                >
                  <TrashIcon weight="fill" size={16} />
                </ButtonAction>
              </div>
            );
          },
        } as ColumnDef<CaixaSaida>,
      ]
    : []),
];

export const fluxoCaixaFilterCols = {
  dataInicio: {
    name: "dataInicio",
    type: "date",
    label: "Data de Início",
  },
  dataFim: {
    name: "dataFim",
    type: "date",
    label: "Data de Fim",
  },
};
