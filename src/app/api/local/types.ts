import z from "zod";

export type Local = {
  id: number;
  uuid?: string;
  descricao: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  empresaId: number;
};

export const localSchema = z.object({
  descricao: z.string().min(1, "Campo Obrigatório"),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
});
