import { z } from "zod";

export const empresaCreateSchema = z.object({
  nome: z.string().min(1, "Campo Obrigatório"),
  email: z.email(),
  senha: z.string().min(6),
  cnpj: z.string().min(14).max(18),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional().nullable(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  estado: z.string().optional(),
  telefone: z.string().optional(),
});

export const empresaUpdateSchema = empresaCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
  });
