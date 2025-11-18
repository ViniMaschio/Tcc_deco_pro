import z from "zod";

export type ContaPagar = {
  id: number;
  uuid?: string;
  empresaId?: number;
  fornecedorId: number;
  fornecedor?: {
    id: number;
    nome: string;
  };
  descricao?: string;
  dataVencimento?: string | Date;
  dataPagamento?: string | Date;
  valorPago: number;
  valorRestante?: number;
  valorTotal: number;
  status: "PENDENTE" | "PARCIAL" | "PAGO" | "VENCIDO" | "CANCELADO";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export const contaPagarSchema = z.object({
  fornecedorId: z.number().int().positive("Fornecedor é obrigatório"),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  dataPagamento: z.string().optional(),
  valorPago: z.number().int().min(0).default(0),
  valorRestante: z.number().int().min(0).optional(),
  valorTotal: z.number().int().positive("Valor total é obrigatório"),
  status: z.enum(["PENDENTE", "PARCIAL", "PAGO", "VENCIDO", "CANCELADO"]).default("PENDENTE"),
});
