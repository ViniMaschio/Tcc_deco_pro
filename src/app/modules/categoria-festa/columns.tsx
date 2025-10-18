import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import { CategoriaFesta } from "@/app/api/categoria-festa/types";
import { ButtonAction } from "@/components/ui/button-action";

interface ColumnsProps {
  onEdit: (categoriaFesta: CategoriaFesta) => void;
  onDelete: (categoriaFesta: CategoriaFesta) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<CategoriaFesta>[] => [
  {
    id: "descricao",
    accessorKey: "descricao",
    meta: {
      name: "Descrição",
    },
    header: () => {
      return <span>Descrição</span>;
    },
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="capitalize">{date.toLocaleDateString("pt-BR")}</div>;
    },
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
      const categoriaFesta = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(categoriaFesta)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(categoriaFesta)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const categoriaFestaFilterCols = {
  descricao: {
    name: "descricao",
    sortName: "descricao",
    type: "text",
    label: "Descrição",
    sortable: true,
  },
};

type Filters = keyof typeof categoriaFestaFilterCols;

export type CategoriaFestaFilterType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
