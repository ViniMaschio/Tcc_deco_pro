import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import { Fornecedor } from "@/app/api/fornecedor/types";
import { ButtonAction } from "@/components/ui/button-action";
import { formatCEPCodeNumber, formatCNPJNumber, formatPhoneNumber } from "@/utils/mask";

interface ColumnsProps {
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (fornecedor: Fornecedor) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Fornecedor>[] => [
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
    id: "cnpj",
    accessorKey: "cnpj",
    meta: {
      name: "CNPJ",
    },
    header: () => {
      return <span>CNPJ</span>;
    },
    cell: ({ row }) => <div className="capitalize">{formatCNPJNumber(row.getValue("cnpj"))}</div>,
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
    cell: ({ row }) => <div className="capitalize">{formatCEPCodeNumber(row.getValue("cep"))}</div>,
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
      <div className="capitalize">{formatPhoneNumber(row.getValue("telefone"))}</div>
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
      const fornecedor = row.original;
      return (
        <div className="flex items-center gap-1">
          <ButtonAction
            className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-500/80"
            variant="outline"
            tooltip="Editar"
            onClick={() => onEdit(fornecedor)}
          >
            <PencilIcon weight="fill" size={16} />
          </ButtonAction>
          <ButtonAction
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
            variant="outline"
            tooltip="Excluir"
            onClick={() => onDelete(fornecedor)}
          >
            <TrashIcon weight="fill" size={16} />
          </ButtonAction>
        </div>
      );
    },
  },
];

export const fornecedorFilterCols = {
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

type Filters = keyof typeof fornecedorFilterCols;

export type FornecedorFilterType = {

  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
