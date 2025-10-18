export interface Categoria {
  id: number;
  descricao: string;
}

export interface CategoriaAutocompleteProps {
  onSelect: (categoria: Categoria | null) => void;
  categoria?: Categoria;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface UseCategoriaAutocompleteProps {
  onSelect: (categoria: Categoria | null) => void;
  categoria?: Categoria;
}
