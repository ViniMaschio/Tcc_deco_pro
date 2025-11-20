import { Contrato as ContratoAPI } from "@/app/api/contrato/types";

export type Contrato = Pick<ContratoAPI, "id" | "cliente" | "local" | "dataEvento" | "total"> & {
  cliente?: {
    id: number;
    nome: string;
  };
  local?: {
    id: number;
    descricao: string;
  };
};

export interface UseContratosAutocompleteProps {
  onSelect?: (contrato: Contrato | null) => void;
  contrato?: Contrato;
  clienteId?: number; // Filtrar contratos por cliente
}

export interface ContratoAutocompleteProps {
  onSelect?: (contrato: Contrato | null) => void;
  contrato?: Contrato;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clienteId?: number; // Filtrar contratos por cliente
  showClear?: boolean; // Mostrar botão de limpar
}
