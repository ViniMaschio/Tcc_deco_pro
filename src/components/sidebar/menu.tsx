import {
  MdAccountBalance,
  MdAddBox,
  MdAssignment,
  MdDashboard,
  MdDescription,
  MdEvent,
} from "react-icons/md";

interface MenuProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  pathnames: string[];
  submenus?: Omit<MenuProps, "pathnames">[];
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
    id: "financeiro",
    label: "Financeiro",
    icon: <MdAccountBalance size={20} />,
    path: "/financeiro",
    pathnames: ["/financeiro"],
  },
  {
    id: "cadastros",
    label: "Cadastros",
    icon: <MdAddBox size={20} />,
    pathnames: ["/fornecedor"],
    submenus: [
      {
        id: "fornecedor",
        label: "Fornecedor",
        path: "/fornecedor",
      },
    ],
  },
];
