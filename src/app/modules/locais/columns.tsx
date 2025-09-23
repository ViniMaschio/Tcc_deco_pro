import { ColumnDef } from "@tanstack/react-table";

import { Local } from "@/app/api/local/types";

export const columns: ColumnDef<Local>[] = [
  {
    id: "id",
    accessorKey: "id",
    meta: {
      name: "ID",
    },
    header: () => {
      return <span>ID</span>;
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
    id: "cep",
    accessorKey: "cep",
    meta: {
      name: "CEP",
    },
    header: () => {
      return <span>CEP</span>;
    },
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
  },
];

export const localFilterCols = {
  descricao: {
    name: "descricao",
    sortName: "descricao",
    type: "text",
    label: "Descrição",
    sortable: true,
    fields: [],
  },
};

type Filters = keyof typeof localFilterCols;

export type LocalFilterType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Filters]: any;
} & {
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};
