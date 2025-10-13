import { Local } from "@/app/api/local/types";

export type LocalModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  local?: Local;
  afterSubmit: () => void;
};

export type LocalPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
};

export type LocalModalStates = {
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
