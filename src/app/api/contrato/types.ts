import { StatusLabelEnum } from "@/app/modules/contrato/enum";
import { Item } from "@/generated/prisma";

export type ContratoStatus = keyof typeof StatusLabelEnum;

export interface Contrato {
  id: number;
  uuid: string;
  empresaId: number;
  clienteId: number;
  categoriaId?: number;
  localId?: number;
  orcamentoId?: number;
  dataEvento: Date;
  horaInicio: Date;
  status: ContratoStatus;
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
  orcamento?: {
    id: number;
    uuid: string;
  };
  itens?: ContratoItem[];
}

export interface ContratoItem {
  id: number;
  contratoId?: number;
  itemId: number;
  quantidade: number;
  desconto: number;
  valorUnit: number;
  valorTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deleted: boolean;
  item?: Item;
}

export interface CreateContratoData {
  clienteId: number;
  status?: ContratoStatus;
  categoriaId?: number;
  localId?: number;
  orcamentoId?: number;
  dataEvento: string;
  horaInicio: string;
  observacao?: string;
  itens: {
    itemId: number;
    nome: string;
    quantidade: number;
    valorUnit: number;
    desconto?: number;
    valorTotal?: number;
  }[];
}

export interface UpdateContratoData extends Partial<CreateContratoData> {
  status?: ContratoStatus;
}

export interface ContratoFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
