import { Fornecedor as FornecedorAPI } from "@/app/api/fornecedor/types";

export type Fornecedor = FornecedorAPI;

export interface UseFornecedoresAutocompleteProps {
  onSelect?: (fornecedor: Fornecedor | null) => void;
  fornecedor?: Fornecedor;
}

export interface FornecedorAutocompleteProps {
  onSelect?: (fornecedor: Fornecedor | null) => void;
  fornecedor?: Fornecedor;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
