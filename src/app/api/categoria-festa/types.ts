export interface CategoriaFesta {
  id: number;
  uuid: string;
  descricao: string;
  empresaId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  deleted: boolean;
}

export interface CreateCategoriaFestaRequest {
  descricao: string;
}

export interface UpdateCategoriaFestaRequest {
  descricao: string;
}

export interface CategoriaFestaResponse {
  categoriaFesta: CategoriaFesta | null;
  message: string;
}

export interface CategoriaFestaListResponse {
  data: CategoriaFesta[];
  pagination: {
    count: number;
    perPage: number;
    pagesCount: number;
    currentPage: number;
  } | null;
  message?: string;
}
