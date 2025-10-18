import { Local as LocalAPI } from "@/app/api/local/types";

export type Local = LocalAPI;

export interface UseLocaisAutocompleteProps {
  onSelect?: (local: Local | null) => void;
  local?: Local;
}

export interface LocalAutocompleteProps {
  onSelect?: (local: Local | null) => void;
  local?: Local;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
