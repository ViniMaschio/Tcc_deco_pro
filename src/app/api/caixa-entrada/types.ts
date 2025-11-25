export type CaixaEntrada = {
  id: number;
  uuid?: string;
  empresaId: number;
  contasReceberId: number;
  descricao?: string;
  valor: number; // Valor em centavos
  dataRecebimento: string | Date;
  metodo: "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "BOLETO" | "TED" | "DOC" | "OUTRO";
  contaReceber?: {
    id: number;
    descricao?: string;
    valor: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
