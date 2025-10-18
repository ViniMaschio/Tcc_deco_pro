import { CategoriaFesta } from "@/app/api/categoria-festa/types";

export type CategoriaFestaModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  categoriaFesta?: CategoriaFesta;
  afterSubmit: () => void;
};

export type CategoriaFestaPageStates = {
  showModal: boolean;
  showDialog: boolean;
};

export type CategoriaFestaModalStates = {
  submitting: boolean;
};
