import { Cliente as ClienteAPI } from "@/app/api/cliente/types";

export type Cliente = ClienteAPI;

export interface UseClientesAutocompleteProps {
  onSelect?: (cliente: Cliente | null) => void;
  cliente?: Cliente;
}

export interface ClienteAutocompleteProps {
  onSelect?: (cliente: Cliente | null) => void;
  cliente?: Cliente;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
