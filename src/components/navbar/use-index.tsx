import { usePathname } from "next/navigation";
import { useState } from "react";

export const useNavBar = () => {
  const pathname = usePathname();

  const [showState, setShowState] = useState({
    showModal: false,
  });

  const changeShowState = (name: keyof typeof showState, value: boolean) => {
    setShowState((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/agenda":
        return "Agenda";
      case "/contrato":
        return "Contratos";
      case "/orcamento":
        return "Orçamentos";
      case "/financeiro":
      case "/financeiro/entrada-saida":
        return "Entrada e Saída";
      case "/financeiro/fluxo-caixa":
        return "Fluxo de Caixa";
      case "/fornecedor":
        return "Fornecedores";
      case "/local":
        return "Locais";
      case "/cliente":
        return "Clientes";
      case "/item":
        return "Itens";
      case "/categoria-festa":
        return "Categorias de Festa";
      default:
        return "";
    }
  };

  return {
    showState,
    changeShowState,
    getPageTitle,
  };
};
