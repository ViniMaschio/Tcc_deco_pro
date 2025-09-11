"use server";

import { getServerSession } from "next-auth";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdDescription,
  MdInfo,
  MdLocationOn,
  MdPeople,
} from "react-icons/md";

import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Dados mockados baseados na imagem
  const metrics = [
    {
      title: "Clientes",
      value: "+2,350",
      change: "+12% este mês",
      icon: <MdPeople size={24} />,
      color: "text-blue-600",
    },
    {
      title: "Contratos Ativos",
      value: "123",
      change: "3 eventos esta semana",
      icon: <MdDescription size={24} />,
      color: "text-green-600",
    },
    {
      title: "Receita Mensal",
      value: "R$45,231.89",
      change: "+8% vs mês anterior",
      icon: <MdAttachMoney size={24} />,
      color: "text-purple-600",
    },
    {
      title: "Contas Pendentes",
      value: "5",
      change: "Próximos 7 dias",
      icon: <MdInfo size={24} />,
      color: "text-orange-600",
    },
  ];

  const orcamentos = [
    {
      cliente: "Maria Silva",
      valor: "R$ 3.500",
      status: "ENVIADO",
    },
    {
      cliente: "João Santos",
      valor: "R$ 7.200",
      status: "ENVIADO",
    },
  ];

  const eventos = [
    {
      titulo: "Casamento - Maria & João",
      local: "Clube Recreativo",
      data: "24/08/2024",
    },
    {
      titulo: "Aniversário - Empresa XYZ",
      local: "Salão de Festas",
      data: "27/08/2024",
    },
  ];

  const cards = [
    { title: "Itens", value: "289" },
    { title: "Locais", value: "18" },
    { title: "Fornecedores", value: "32" },
    { title: "Orçamentos Pendentes", value: "8" },
  ];

  return (
    <div className="mx-1 mb-2 overflow-auto rounded-b-md bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        {/* <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1> */}
        <h2 className="mb-2 text-xl text-gray-600 font-semibold">
          Bem-vindo de volta, {session?.user?.name || "Usuário"} 👋
        </h2>
        <p className="mb-4 text-gray-600">
          Aqui você acompanha seus contratos, orçamentos e finanças em um só
          lugar.
        </p>

        {/* Filtros de Data */}
        <div className="flex gap-2">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Últimos 7 dias
          </button>
          <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Últimos 30 dias
          </button>
          <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Últimos 3 meses
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg bg-gray-100 p-2 ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              {metric.title}
            </h3>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {metric.value}
            </p>
            <p className="text-sm text-gray-500">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Seções de Orçamentos e Eventos */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orçamentos */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orçamentos</h3>
            <p className="text-sm text-gray-600">
              You made 265 sales this month.
            </p>
          </div>
          <div className="space-y-3">
            {orcamentos.map((orcamento, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {orcamento.cliente}
                  </p>
                  <p className="text-sm text-gray-600">{orcamento.valor}</p>
                </div>
                <button className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  {orcamento.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Próximos Eventos
            </h3>
            <p className="text-sm text-gray-600">
              Eventos agendados para os próximos dias
            </p>
          </div>
          <div className="space-y-3">
            {eventos.map((evento, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <MdCalendarToday size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{evento.titulo}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MdLocationOn size={14} />
                      <span>{evento.local}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {evento.data}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Inferiores */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg border bg-white p-6 text-center shadow-sm"
          >
            <div className="mb-3 flex justify-center">
              <MdPeople size={24} className="text-gray-600" />
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {card.value}
            </p>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
