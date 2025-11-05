"use client";

import { useSession } from "next-auth/react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdDescription,
  MdInfo,
  MdLocationOn,
  MdPeople,
} from "react-icons/md";

import { usePage } from "./use-page";

export default function Home() {
  const { data: session } = useSession();
  const { data, isLoading } = usePage();

  const metrics = data
    ? [
        {
          title: "Clientes",
          value: data.metrics.clientes.total.toLocaleString("pt-BR"),
          change: data.metrics.clientes.variacao,
          icon: <MdPeople size={24} />,
          color: "text-blue-600",
        },
        {
          title: "Contratos Ativos",
          value: data.metrics.contratosAtivos.total.toString(),
          change: data.metrics.contratosAtivos.label,
          icon: <MdDescription size={24} />,
          color: "text-green-600",
        },
        {
          title: "Receita Mensal",
          value: data.metrics.receita.valor,
          change: data.metrics.receita.variacao,
          icon: <MdAttachMoney size={24} />,
          color: "text-purple-600",
        },
        {
          title: "Contas Pendentes",
          value: data.metrics.contasPendentes.total.toString(),
          change: data.metrics.contasPendentes.label,
          icon: <MdInfo size={24} />,
          color: "text-orange-600",
        },
      ]
    : [];

  const orcamentos = data?.orcamentos || [];
  const eventos = data?.eventos || [];
  const cards = data
    ? [
        { title: "Itens", value: data.cards.itens.toString() },
        { title: "Locais", value: data.cards.locais.toString() },
        { title: "Fornecedores", value: data.cards.fornecedores.toString() },
        {
          title: "Orçamentos Pendentes",
          value: data.cards.orcamentosPendentes.toString(),
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="mx-1 mb-2 overflow-auto rounded-b-md bg-white p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-gray-600">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-1 mb-2 overflow-auto rounded-b-md bg-white p-6">
      <div className="mb-8 flex flex-col justify-between xl:flex-row">
        <div>
          <h2 className="mb-2 text-xl font-semibold text-gray-600">
            Bem-vindo de volta, {session?.user?.name || "Usuário"} 👋
          </h2>
          <p className="mb-4 text-gray-600">
            Aqui você acompanha seus contratos, orçamentos e finanças em um só lugar.
          </p>
        </div>

      </div>

      {/* Métricas Principais */}
      {metrics.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg bg-gray-100 p-2 ${metric.color}`}>{metric.icon}</div>
              </div>
              <h3 className="mb-1 text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="mb-1 text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.change}</p>
            </div>
          ))}
        </div>
      )}

      {/* Seções de Orçamentos e Eventos */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orçamentos */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orçamentos Recentes</h3>
            <p className="text-sm text-gray-600">
              {orcamentos.length > 0
                ? `${orcamentos.length} orçamentos encontrados`
                : "Nenhum orçamento encontrado"}
            </p>
          </div>
          <div className="space-y-3">
            {orcamentos.length > 0 ? (
              orcamentos.map((orcamento) => (
                <div
                  key={orcamento.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{orcamento.cliente}</p>
                    <p className="text-sm text-gray-600">{orcamento.valor}</p>
                  </div>
                  <span
                    className={`rounded px-3 py-1 text-xs font-medium text-white ${
                      orcamento.status === "APROVADO"
                        ? "bg-green-600"
                        : orcamento.status === "ENVIADO"
                          ? "bg-blue-600"
                          : orcamento.status === "REJEITADO"
                            ? "bg-red-600"
                            : "bg-gray-600"
                    }`}
                  >
                    {orcamento.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                Nenhum orçamento recente
              </p>
            )}
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
            <p className="text-sm text-gray-600">Eventos agendados para os próximos dias</p>
          </div>
          <div className="space-y-3">
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <div
                  key={evento.id}
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
                  <span className="text-sm font-medium text-gray-700">{evento.data}</span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                Nenhum evento próximo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cards Inferiores */}
      {cards.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((card, index) => (
            <div key={index} className="rounded-lg border bg-white p-6 text-center shadow-sm">
              <div className="mb-3 flex justify-center">
                <MdPeople size={24} className="text-gray-600" />
              </div>
              <p className="mb-1 text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
