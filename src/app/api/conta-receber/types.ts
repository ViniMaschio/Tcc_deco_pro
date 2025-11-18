import z from "zod";

export type ContaReceber = {
  id: number;
  uuid?: string;
  empresaId?: number;
  clienteId: number;
  cliente?: {
    id: number;
    nome: string;
  };
  contratoId?: number;
  contrato?: {
    id: number;
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

export const contaReceberSchema = z.object({
  clienteId: z.number().int().positive("Cliente é obrigatório"),
  contratoId: z.number().int().positive().optional(),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  dataPagamento: z.string().optional(),
  valorPago: z.number().int().min(0).default(0),
  valorRestante: z.number().int().min(0).optional(),
  valorTotal: z.number().int().positive("Valor total é obrigatório"),
  status: z.enum(["PENDENTE", "PARCIAL", "PAGO", "VENCIDO", "CANCELADO"]).default("PENDENTE"),
});
