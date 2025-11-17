import z from "zod";

export type Fornecedor = {
  id: number;
  uuid?: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  empresaId?: number;
};

export const fornecedorSchema = z.object({
  nome: z.string().min(3, "Campo Obrigatório"),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
});

