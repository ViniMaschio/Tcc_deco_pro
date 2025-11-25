import z from "zod";

export type ContaPagar = {
  id: number;
  uuid?: string;
  empresaId?: number;
  fornecedorId?: number | null;
  fornecedor?: {
    id: number;
    nome: string;
  };
  descricao?: string;
  dataVencimento?: string | Date;
  dataPagamento?: string | Date;
  valor: number; // Valor em centavos
  valorPago?: number; // Calculado: soma das caixaSaidas
  valorRestante?: number; // Calculado: valor - valorPago
  valorTotal?: number; // Alias para valor (compatibilidade)
  status: "PENDENTE" | "FINALIZADO";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export const contaPagarSchema = z.object({
  fornecedorId: z.number().int().positive().optional().nullable(),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  dataPagamento: z.string().optional(),
  valor: z.number().int().positive("Valor é obrigatório"),
  status: z.enum(["PENDENTE", "FINALIZADO"]).default("PENDENTE"),
});
