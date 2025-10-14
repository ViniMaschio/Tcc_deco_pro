import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import { Item } from "@/app/api/item/types";
import { ButtonAction } from "@/components/ui/button-action";

interface ColumnsProps {
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Item>[] => [
  {
    id: "nome",
    accessorKey: "nome",
    meta: {
      name: "Nome",
    },
    header: () => {
      return <span>Nome</span>;
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => {
      return <span>Descrição</span>;
    },
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("descricao") || "-"}</div>
    ),
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    meta: {
      name: "Tipo",
    },
    header: () => {
      return <span>Tipo</span>;
    },
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as "PRO" | "SER";
      return (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              tipo === "PRO" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            }`}
          >
            {tipo === "PRO" ? "Produto" : "Serviço"}
          </span>
        </div>
      );
    },
  },
  {
    id: "precoBase",
    accessorKey: "precoBase",
    meta: {
      name: "Preço Base",
    },
    header: () => {
      return <span>Preço Base</span>;
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.getValue("precoBase")))}
      </div>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    meta: {
      name: "Data de Criação",
    },
    header: () => {
      return <span>Data de Criação</span>;
    },
    cell: ({ row }) => <div>{new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR")}</div>,
  },
  {
    id: "actions",
    meta: {
      name: "Ações",
    },
    header: () => {
      return <span>Ações</span>;
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(item)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(item)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const itemFilterCols = {
  nome: {
    name: "nome",
    sortName: "nome",
    type: "text",
    label: "Nome",
    sortable: true,
  },
  descricao: {
    name: "descricao",
    sortName: "descricao",
    type: "text",
    label: "Descrição",
    sortable: true,
  },
  tipo: {
    name: "tipo",
    sortName: "tipo",
    type: "select",
    label: "Tipo",
    sortable: true,
    options: [
      { value: "", label: "Todos" },
      { value: "PRO", label: "Produto" },
      { value: "SER", label: "Serviço" },
    ],
  },
};

type Filters = keyof typeof itemFilterCols;

export type ItemFilterType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
