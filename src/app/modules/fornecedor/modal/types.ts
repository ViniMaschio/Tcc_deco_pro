import { Fornecedor } from "@/app/api/fornecedor/types";

export type FornecedorModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  fornecedor?: Fornecedor;
  afterSubmit: () => void;
};

export type FornecedorPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
};

export type FornecedorFilterType = {
  nome: string;
  cidade: string;
  cep: string;
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};

export type FornecedorModalStates = {
  zipCode: boolean;
  submitting: boolean;
};

export interface ZipCodeResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

