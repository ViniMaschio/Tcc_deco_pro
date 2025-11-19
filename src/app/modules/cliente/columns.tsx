import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import { Cliente } from "@/app/api/cliente/types";
import { ButtonAction } from "@/components/ui/button-action";
import { formatCEPCodeNumber, formatPhoneNumber } from "@/utils/mask";

interface ColumnsProps {
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Cliente>[] => [
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
    id: "rua",
    accessorKey: "rua",
    meta: {
      name: "Rua",
    },
    header: () => {
      return <span>Rua</span>;
    },
  },
  {
    id: "numero",
    accessorKey: "numero",
    meta: {
      name: "Numero",
    },
    header: () => {
      return <span>Numero</span>;
    },
  },
  {
    id: "bairro",
    accessorKey: "bairro",
    meta: {
      name: "Bairro",
    },
    header: () => {
      return <span>Bairro</span>;
    },
  },
  {
    id: "estado",
    accessorKey: "estado",
    meta: {
      name: "Estado",
    },
    header: () => {
      return <span>Estado</span>;
    },
  },
  {
    id: "cidade",
    accessorKey: "cidade",
    meta: {
      name: "Cidade",
    },
    header: () => {
      return <span>Cidade</span>;
    },
  },
  {
    id: "complemento",
    accessorKey: "complemento",
    meta: {
      name: "Complemento",
    },
    header: () => {
      return <span>Complemento</span>;
    },
  },
  {
    id: "cep",
    accessorKey: "cep",
    meta: {
      name: "CEP",
    },
    header: () => {
      return <span>CEP</span>;
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatCEPCodeNumber(row.getValue("cep"))}
      </div>
    ),
  },
  {
    id: "telefone",
    accessorKey: "telefone",
    meta: {
      name: "Telefone",
    },
    header: () => {
      return <span>Telefone</span>;
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {formatPhoneNumber(row.getValue("telefone"))}
      </div>
    ),
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
      const cliente = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(cliente)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(cliente)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const clienteFilterCols = {
  nome: {
    name: "nome",
    sortName: "nome",
    type: "text",
    label: "Nome",
    sortable: true,
  },
  cidade: {
    name: "cidade",
    sortName: "cidade",
    type: "text",
    label: "Cidade",
    sortable: true,
  },
  cep: {
    name: "cep",
    sortName: "cep",
    type: "text",
    label: "CEP",
    sortable: true,
  },
};

type Filters = keyof typeof clienteFilterCols;

export type ClienteFilterType = {

  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
