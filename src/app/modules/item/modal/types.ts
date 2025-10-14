import { Item } from "@/app/api/item/types";

export type ItemModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  item?: Item;
  afterSubmit: () => void;
};

export type ItemPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
};

export type ItemFilterType = {
  nome: string;
  descricao: string;
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};

export type ItemModalStates = {
  submitting: boolean;
};

export interface ItemFormData {
  nome: string;
  descricao: string;
  precoBase: number;
}
