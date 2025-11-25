import { HiTicket } from "react-icons/hi2";
import { FaTruck } from "react-icons/fa";
import {
  MdAccountBalance,
  MdAddBox,
  MdAssignment,
  MdCategory,
  MdDashboard,
  MdDescription,
  MdEvent,
  MdInventory,
  MdPeopleAlt,
  MdPinDrop,
} from "react-icons/md";

interface MenuItemChild {
  id: string;
  label: string;
  path: string;
  pathnames: string[];
}

interface MenuProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  pathnames: string[];
  children?: MenuItemChild[];
}

export const menuItems: MenuProps[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    path: "/",
    pathnames: ["/"],
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: <MdEvent size={20} />,
    path: "/agenda",
    pathnames: ["/agenda"],
  },
  {
    id: "contratos",
    label: "Contratos",
    icon: <MdDescription size={20} />,
    path: "/contrato",
    pathnames: ["/contrato"],
  },
  {
    id: "orcamentos",
    label: "Orçamentos",
    icon: <MdAssignment size={20} />,
    path: "/orcamento",
    pathnames: ["/orcamento"],
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: <MdPeopleAlt size={20} />,
    path: "/cliente",
    pathnames: ["/cliente"],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: <MdAccountBalance size={20} />,
    pathnames: ["/financeiro"],
    children: [
      {
        id: "financeiro-entrada-saida",
        label: "Entrada e Saída",
        path: "/financeiro/entrada-saida",
        pathnames: ["/financeiro/entrada-saida"],
      },
      {
        id: "financeiro-fluxo-caixa",
        label: "Fluxo de Caixa",
        path: "/financeiro/fluxo-caixa",
        pathnames: ["/financeiro/fluxo-caixa"],
      },
    ],
  },
  {
    id: "fornecedor",
    label: "Fornecedores",
    icon: <FaTruck size={20} />,
    path: "/fornecedor",
    pathnames: ["/fornecedor"],
  },
  {
    id: "locais",
    label: "Locais",
    icon: <MdPinDrop size={20} />,
    path: "/local",
    pathnames: ["/local"],
  },
  {
    id: "itens",
    label: "Itens",
    icon: <MdInventory size={20} />,
    path: "/item",
    pathnames: ["/item"],
  },
  {
    id: "categoria-festa",
    label: "Categoria Festa",
    icon: <HiTicket size={20} />,
    path: "/categoria-festa",
    pathnames: ["/categoria-festa"],
  },
];
