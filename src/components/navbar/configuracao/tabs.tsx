import { Building2, FileText, Palette } from "lucide-react";
import { EmpresaTab } from "./tabs/empresa";
import { ContratoTab } from "./tabs/contrato";
import { TemaTab } from "./tabs/tema";

export const MountTabs = () => {
  const style = "text-[24px] text-disabled data-[selected=true]:text-primary-500";

  const tabs = {
    // Opções de seleção
    trigger: [
      {
        name: "empresa",
        label: "Empresa",
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        name: "contrato",
        label: "Contrato",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        name: "tema",
        label: "Tema",
        icon: <Palette className="h-4 w-4" />,
      },
    ],

    // Telas que serão exibidas em cada Tab
    content: [
      {
        name: "empresa",
        forceMount: true,
        render: <EmpresaTab />,
      },
      {
        name: "contrato",
        forceMount: true,
        render: <ContratoTab />,
      },
      {
        name: "tema",
        render: <TemaTab />,
      },
    ],
  };

  return { tabs };
};
