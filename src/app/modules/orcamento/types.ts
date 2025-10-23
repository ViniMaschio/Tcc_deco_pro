import { Orcamento } from "@/app/api/orcamento/types";

// Tipos para o modal de orçamento
export type OrcamentoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  data?: Orcamento;
  onSuccess: () => void;
};

// Tipos para estados da página
export type OrcamentoPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
  showViewModal: boolean;
};

// Tipos para filtros
export type OrcamentoFilterType = {
  search: string;
  status: string;
  page: number;
  limit: number;
};

// Tipos para estados do modal
export type OrcamentoModalStates = {
  submitting: boolean;
  activeTab: string;
};

// Tipos para paginação
export type OrcamentoPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Tipos para dados auxiliares
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

// Tipos para props dos componentes
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
  }>;
  onUpdateItem: (
    index: number,
    field: "itemId" | "quantidade" | "valorUnit" | "desconto",
    value: number
  ) => void;
  onRemoveItem: (index: number) => void;
  isViewMode?: boolean;
};

// Tipos para hooks
export type UseOrcamentoModalProps = {
  mode: "create" | "edit" | "view";
  data?: Orcamento;
  onSuccess: () => void;
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
