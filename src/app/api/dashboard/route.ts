import { NextRequest, NextResponse } from "next/server";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    // Buscar estatísticas
    const [
      totalClientes,
      clientesEsteMes,
      contratosAtivos,
      eventosEstaSemana,
      receitaMensal,
      receitaMesAnterior,
      contasPendentes,
      orcamentosRecentes,
      proximosEventos,
      totalItens,
      totalLocais,
      totalFornecedores,
      orcamentosPendentes,
    ] = await Promise.all([
      // Total de clientes
      db.cliente.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      // Clientes criados este mês
      db.cliente.count({
        where: {
          empresaId,
          deleted: false,
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      // Contratos ativos
      db.contrato.count({
        where: {
          empresaId,
          deleted: false,
          status: "ATIVO",
        },
      }),
      // Eventos esta semana
      db.contrato.count({
        where: {
          empresaId,
          deleted: false,
          dataEvento: {
            gte: startOfWeek,
            lte: nextWeek,
          },
        },
      }),
      // Receita mensal (contas receber pagas este mês)
      db.caixaEntrada.aggregate({
        where: {
          empresaId,
          dataRecebimento: {
            gte: startOfMonth,
          },
        },
        _sum: {
          valor: true,
        },
      }),
      // Receita mês anterior
      db.caixaEntrada.aggregate({
        where: {
          empresaId,
          dataRecebimento: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: {
          valor: true,
        },
      }),
      // Contas pendentes (próximos 7 dias)
      db.contaReceber.count({
        where: {
          empresaId,
          deleted: false,
          status: "PENDENTE",
          dataVencimento: {
            gte: now,
            lte: nextWeek,
          },
        },
      }),
      // Orçamentos recentes
      db.orcamento.findMany({
        where: {
          empresaId,
          deleted: false,
        },
        include: {
          cliente: {
            select: {
              nome: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
      // Próximos eventos (contratos)
      db.contrato.findMany({
        where: {
          empresaId,
          deleted: false,
          dataEvento: {
            gte: now,
          },
        },
        include: {
          cliente: {
            select: {
              nome: true,
            },
          },
          local: {
            select: {
              descricao: true,
            },
          },
        },
        orderBy: {
          dataEvento: "asc",
        },
        take: 5,
      }),
      // Total de itens
      db.item.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      // Total de locais
      db.localEvento.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      // Total de fornecedores
      db.fornecedor.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      // Orçamentos pendentes
      db.orcamento.count({
        where: {
          empresaId,
          deleted: false,
          status: {
            in: ["RASCUNHO", "ENVIADO"],
          },
        },
      }),
    ]);

    // Calcular variações
    const receitaAtual = receitaMensal._sum.valor || 0;
    const receitaAnterior = receitaMesAnterior._sum.valor || 0;
    const variacaoReceita =
      receitaAnterior > 0
        ? Math.round(((receitaAtual - receitaAnterior) / receitaAnterior) * 100)
        : 0;

    // Formatar valores
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value / 100); // Dividir por 100 pois está em centavos
    };

    // Formatar data
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date));
    };

    return NextResponse.json(
      {
        metrics: {
          clientes: {
            total: totalClientes,
            esteMes: clientesEsteMes,
            variacao: clientesEsteMes > 0 ? `+${clientesEsteMes} este mês` : "Sem novos este mês",
          },
          contratosAtivos: {
            total: contratosAtivos,
            eventos: eventosEstaSemana,
            label: eventosEstaSemana > 0 ? `${eventosEstaSemana} eventos esta semana` : "Sem eventos esta semana",
          },
          receita: {
            valor: formatCurrency(receitaAtual),
            variacao: variacaoReceita > 0 ? `+${variacaoReceita}% vs mês anterior` : `${variacaoReceita}% vs mês anterior`,
          },
          contasPendentes: {
            total: contasPendentes,
            label: contasPendentes > 0 ? "Próximos 7 dias" : "Nenhuma conta pendente",
          },
        },
        cards: {
          itens: totalItens,
          locais: totalLocais,
          fornecedores: totalFornecedores,
          orcamentosPendentes,
        },
        orcamentos: orcamentosRecentes.map((orc) => ({
          id: orc.id,
          cliente: orc.cliente.nome,
          valor: formatCurrency(orc.total),
          status: orc.status,
        })),
        eventos: proximosEventos.map((evento) => ({
          id: evento.id,
          titulo: `Contrato - ${evento.cliente.nome}`,
          local: evento.local?.descricao || "Local não definido",
          data: formatDate(evento.dataEvento),
          dataEvento: evento.dataEvento,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

