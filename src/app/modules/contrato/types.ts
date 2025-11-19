import { Contrato } from "@/app/api/contrato/types";

export type ContratoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contrato?: Contrato;
  onSuccess: () => void;
};

export type ContratoPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
  showViewModal: boolean;
};

export type ContratoFilterType = {
  search: string;
  status: string;
  page: number;
  limit: number;
};

export type ContratoModalStates = {
  submitting: boolean;
  activeTab: string;
};

export type ContratoPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
}

export interface Local {
  id: number;
  descricao: string;
}

export interface Categoria {
  id: number;
  descricao: string;
}

export interface Item {
  id: number;
  nome: string;
  descricao?: string;
  precoBase: number;
  tipo: "PRO" | "SER";
}

export interface Orcamento {
  id: number;
  uuid: string;
}

export type ContratoDataTableProps = {
  data: Contrato[];
  isLoading: boolean;
  pagination: ContratoPagination;
  onPaginationChange: (pagination: Partial<ContratoPagination>) => void;
  onEdit: (contrato: Contrato) => void;
  onDelete: (contrato: Contrato) => void;
  onView: (contrato: Contrato) => void;
};

export type ContratoItensTableProps = {
  itens: Array<{
    itemId: number;
    nome: string;
    quantidade: number;
    valorUnit: number;
    desconto?: number;
    valorTotal?: number;
  }>;
  onUpdateItem: (
    index: number,
    field: "itemId" | "quantidade" | "valorUnit" | "desconto",
    value: number
  ) => void;
  onRemoveItem: (index: number) => void;
};

export type UseContratoPageReturn = {
  contratos: Contrato[];
  isLoading: boolean;
  showModal: {
    open: boolean;
    mode: "create" | "edit" | "view";
    data?: Contrato;
  };
  setShowModal: (state: {
    open: boolean;
    mode: "create" | "edit" | "view";
    data?: Contrato;
  }) => void;
  filters: ContratoFilterType;
  setFilters: (filters: Partial<ContratoFilterType>) => void;
  pagination: ContratoPagination;
  setPagination: (pagination: Partial<ContratoPagination>) => void;
  refetch: () => void;
};
