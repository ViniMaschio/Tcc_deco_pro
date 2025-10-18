export interface Orcamento {
  id: number;
  uuid: string;
  empresaId: number;
  clienteId: number;
  categoriaId?: number;
  localId?: number;
  dataEvento?: Date;
  status: "RASCUNHO" | "ENVIADO" | "APROVADO" | "REJEITADO" | "VENCIDO" | "CANCELADO";
  desconto?: number;
  total: number;
  observacao?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  cliente?: {
    id: number;
    nome: string;
    telefone?: string;
    email?: string;
  };
  local?: {
    id: number;
    descricao: string;
  };
  categoriaFesta?: {
    id: number;
    descricao: string;
  };
  itens?: OrcamentoItem[];
}

export interface OrcamentoItem {
  id: number;
  nome: string;
  uuid: string;
  orcamentoId: number;
  itemId: number;
  quantidade: number;
  desconto: number;
  valorUnit: number;
  valorTotal: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  item?: {
    id: number;
    nome: string;
    descricao?: string;
    tipo: "PRO" | "SER";
  };
}

export interface CreateOrcamentoData {
  clienteId: number;
  categoriaId?: number;
  localId?: number;
  dataEvento?: string;
  observacao?: string;
  itens: {
    itemId: number;
    nome: string;
    quantidade: number;
    valorUnit: number;
    desconto?: number;
  }[];
}

export interface UpdateOrcamentoData extends Partial<CreateOrcamentoData> {
  status?: "RASCUNHO" | "ENVIADO" | "APROVADO" | "REJEITADO" | "VENCIDO" | "CANCELADO";
}

export interface OrcamentoFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
