export interface Item {
  id: number;
  uuid: string;
  nome: string;
  descricao?: string | null;
  tipo: "PRO" | "SER";
  precoBase: number;
  empresaId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  deleted: boolean;
}

export interface CreateItemRequest {
  nome: string;
  descricao?: string;
  tipo: "PRO" | "SER";
  precoBase: number;
}

export interface UpdateItemRequest {
  nome?: string;
  descricao?: string;
  tipo?: "PRO" | "SER";
  precoBase?: number;
}
