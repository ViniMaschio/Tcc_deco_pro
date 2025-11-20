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

  if (isLoading) {
    return (
      <div className="mx-1 mb-2 overflow-auto rounded-b-md bg-white p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
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

      {data?.metrics && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2 text-blue-600">
                <MdPeople size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Clientes</h3>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {data.metrics.clientes.total.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm text-gray-500">{data.metrics.clientes.variacao}</p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2 text-green-600">
                <MdDescription size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Contratos Ativos</h3>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {data.metrics.contratosAtivos.total}
            </p>
            <p className="text-sm text-gray-500">{data.metrics.contratosAtivos.label}</p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2 text-purple-600">
                <MdAttachMoney size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Receita Mensal</h3>
            <p className="mb-1 text-2xl font-bold text-gray-900">{data.metrics.receita.valor}</p>
            <p className="text-sm text-gray-500">{data.metrics.receita.variacao}</p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gray-100 p-2 text-orange-600">
                <MdInfo size={24} />
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Contas Pendentes</h3>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {data.metrics.contasPendentes.total}
            </p>
            <p className="text-sm text-gray-500">{data.metrics.contasPendentes.label}</p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orçamentos Recentes</h3>
            <p className="text-sm text-gray-600">
              {data?.orcamentos && data.orcamentos.length > 0
                ? `${data.orcamentos.length} orçamentos encontrados`
                : "Nenhum orçamento encontrado"}
            </p>
          </div>
          <div className="space-y-3">
            {data?.orcamentos && data.orcamentos.length > 0 ? (
              data.orcamentos.map((orcamento) => (
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
              <p className="py-4 text-center text-sm text-gray-500">Nenhum orçamento recente</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
            <p className="text-sm text-gray-600">Eventos agendados para os próximos dias</p>
          </div>
          <div className="space-y-3">
            {data?.eventos && data.eventos.length > 0 ? (
              data.eventos.map((evento) => (
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
              <p className="py-4 text-center text-sm text-gray-500">Nenhum evento próximo</p>
            )}
          </div>
        </div>
      </div>

      {data?.cards && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <MdPeople size={24} className="text-gray-600" />
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-900">{data.cards.itens}</p>
            <p className="text-sm text-gray-600">Itens</p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <MdPeople size={24} className="text-gray-600" />
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-900">{data.cards.locais}</p>
            <p className="text-sm text-gray-600">Locais</p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <MdPeople size={24} className="text-gray-600" />
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-900">{data.cards.fornecedores}</p>
            <p className="text-sm text-gray-600">Fornecedores</p>
          </div>
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <MdPeople size={24} className="text-gray-600" />
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-900">
              {data.cards.orcamentosPendentes}
            </p>
            <p className="text-sm text-gray-600">Orçamentos Pendentes</p>
          </div>
        </div>
      )}
    </div>
  );
}
