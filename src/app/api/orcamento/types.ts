import { StatusLabelEnum } from "@/app/modules/orcamento/enum";

export type OrcamentoStatus = keyof typeof StatusLabelEnum;

export interface Orcamento {
  id: number;
  uuid: string;
  empresaId: number;
  clienteId: number;
  categoriaId?: number;
  localId?: number;
  dataEvento?: Date;
  status: OrcamentoStatus;
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
    cpf?: string;
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
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
  status?: OrcamentoStatus;
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
  status?: OrcamentoStatus;
}

export interface OrcamentoFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
