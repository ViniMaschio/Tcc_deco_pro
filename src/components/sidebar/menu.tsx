import { CiDeliveryTruck } from "react-icons/ci";
import { FaTruck } from "react-icons/fa";
import {
  MdAccountBalance,
  MdAddBox,
  MdAssignment,
  MdDashboard,
  MdDescription,
  MdEvent,
  MdPeopleAlt,
  MdPinDrop,
} from "react-icons/md";

interface MenuProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  pathnames: string[];
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
    path: "/contratos",
    pathnames: ["/contratos"],
  },
  {
    id: "orcamentos",
    label: "Orçamentos",
    icon: <MdAssignment size={20} />,
    path: "/orcamentos",
    pathnames: ["/orcamentos"],
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
    path: "/financeiro",
    pathnames: ["/financeiro"],
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
];
