export type Item = {
  id: number;
  nome: string;
  descricao?: string;
  precoBase: number;
  tipo: "PRO" | "SER";
};

export interface UseItensAutocompleteProps {
  onSelect?: (item: Item | null) => void;
  item?: Item;
}

export interface ItemAutocompleteProps {
  onSelect?: (item: Item | null) => void;
  item?: Item;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onAddItem?: (item: Item) => void;
  showAddButton?: boolean;
  itensAdicionados?: Array<{
    itemId: number;
    quantidade: number;
    valorUnit: number;
    desconto?: number;
  }>;
}
