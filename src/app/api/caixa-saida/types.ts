export type CaixaSaida = {
  id: number;
  uuid?: string;
  empresaId: number;
  contasPagarId: number;
  descricao?: string;
  valor: number; // Valor em centavos
  dataPagamento: string | Date;
  metodo: "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "BOLETO" | "TED" | "DOC" | "OUTRO";
  contaPagar?: {
    id: number;
    descricao?: string;
    valor: number;
    fornecedor?: {
      id: number;
      nome: string;
    };
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
