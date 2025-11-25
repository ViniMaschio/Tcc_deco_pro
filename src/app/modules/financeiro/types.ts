import { ContaPagar } from "@/app/api/conta-pagar/types";
import { ContaReceber } from "@/app/api/conta-receber/types";

export type FinanceiroPageStates = {
  showModal: boolean;
  isLoading: boolean;
  showDialog: boolean;
  showPagarModal?: boolean;
  showReceberModal?: boolean;
  activeTab: "receber" | "pagar";
};

export type FinanceiroFilterType = {
  descricao?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  sorting: {
    name: string;
    type: "asc" | "desc";
  };
};

export type ContaPagarModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  contaPagar?: ContaPagar;
  afterSubmit: () => void;
};

export type ContaReceberModalProps = {
  open: boolean;
  changeOpen: (open: boolean) => void;
  contaReceber?: ContaReceber;
  afterSubmit: () => void;
};

export type FinanceiroModalStates = {
  submitting: boolean;
};
