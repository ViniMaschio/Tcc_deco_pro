import { Orcamento } from "@/app/api/orcamento/types";

export type OrcamentoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento?: Orcamento;
  onSuccess: () => void;
};

export type OrcamentoPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
  showViewModal: boolean;
};

export type OrcamentoFilterType = {
  search: string;
  status: string;
  page: number;
  limit: number;
};

export type OrcamentoModalStates = {
  submitting: boolean;
  activeTab: string;
};

export type OrcamentoPagination = {
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

export type OrcamentoDataTableProps = {
  data: Orcamento[];
  isLoading: boolean;
  pagination: OrcamentoPagination;
  onPaginationChange: (pagination: Partial<OrcamentoPagination>) => void;
  onEdit: (orcamento: Orcamento) => void;
  onDelete: (orcamento: Orcamento) => void;
  onView: (orcamento: Orcamento) => void;
};

export type OrcamentoItensTableProps = {
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

export type UseOrcamentoPageReturn = {
  orcamentos: Orcamento[];
  isLoading: boolean;
  showModal: {
    open: boolean;
    mode: "create" | "edit" | "view";
    data?: Orcamento;
  };
  setShowModal: (state: {
    open: boolean;
    mode: "create" | "edit" | "view";
    data?: Orcamento;
  }) => void;
  filters: OrcamentoFilterType;
  setFilters: (filters: Partial<OrcamentoFilterType>) => void;
  pagination: OrcamentoPagination;
  setPagination: (pagination: Partial<OrcamentoPagination>) => void;
  refetch: () => void;
};
