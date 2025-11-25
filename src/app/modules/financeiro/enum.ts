export enum StatusLabelEnum {
  PENDENTE = "Pendente",
  FINALIZADO = "Finalizado",
}

// Labels específicos para exibição no frontend
export const getStatusLabel = (status: "PENDENTE" | "FINALIZADO", tipo: "pagar" | "receber") => {
  if (status === "FINALIZADO") {
    return tipo === "pagar" ? "Pago" : "Recebido";
  }
  return "Pendente";
};

export enum StatusColorEnum {
  PENDENTE = "bg-gray-100 text-gray-800",
  FINALIZADO = "bg-green-100 text-green-800",
}
