import { Cliente } from "@/app/api/cliente/types";

export type ClienteModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  cliente?: Cliente;
  afterSubmit: () => void;
};

export type ClientePageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
};

export type ClienteModalStates = {
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
