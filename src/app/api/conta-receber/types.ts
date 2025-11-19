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
  valor: number; // Valor em centavos
  valorPago?: number; // Calculado: soma das caixaEntradas
  valorRestante?: number; // Calculado: valor - valorPago
  valorTotal?: number; // Alias para valor (compatibilidade)
  status: "PENDENTE" | "PAGO" | "CANCELADO";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export const contaReceberSchema = z.object({
  clienteId: z.number().int().positive("Cliente é obrigatório"),
  contratoId: z.number().int().positive().optional(),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  dataPagamento: z.string().optional(),
  valor: z.number().int().positive("Valor é obrigatório"),
  status: z.enum(["PENDENTE", "PAGO", "CANCELADO"]).default("PENDENTE"),
});
