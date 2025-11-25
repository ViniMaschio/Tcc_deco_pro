import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

const querySchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { dataInicio, dataFim } = parsed.data;

    // Construir filtros de data para entradas
    const whereEntradas: any = {
      empresaId,
      deleted: false,
    };

    if (dataInicio || dataFim) {
      whereEntradas.dataRecebimento = {};
      if (dataInicio) {
        // Criar data no início do dia em UTC para evitar problemas de timezone
        const startDate = new Date(dataInicio + "T00:00:00.000Z");
        whereEntradas.dataRecebimento.gte = startDate;
      }
      if (dataFim) {
        // Criar data no final do dia em UTC para evitar problemas de timezone
        const endDate = new Date(dataFim + "T23:59:59.999Z");
        whereEntradas.dataRecebimento.lte = endDate;
      }
    }

    // Construir filtros de data para saídas
    const whereSaidas: any = {
      empresaId,
      deleted: false,
    };

    if (dataInicio || dataFim) {
      whereSaidas.dataPagamento = {};
      if (dataInicio) {
        // Criar data no início do dia em UTC para evitar problemas de timezone
        const startDate = new Date(dataInicio + "T00:00:00.000Z");
        whereSaidas.dataPagamento.gte = startDate;
      }
      if (dataFim) {
        // Criar data no final do dia em UTC para evitar problemas de timezone
        const endDate = new Date(dataFim + "T23:59:59.999Z");
        whereSaidas.dataPagamento.lte = endDate;
      }
    }

    // Buscar totais de entradas e saídas
    const [entradas, saidas] = await Promise.all([
      db.caixaEntrada.aggregate({
        where: whereEntradas,
        _sum: {
          valor: true,
        },
      }),
      db.caixaSaida.aggregate({
        where: whereSaidas,
        _sum: {
          valor: true,
        },
      }),
    ]);

    const totalRecebido = entradas._sum.valor || 0;
    const totalPago = saidas._sum.valor || 0;
    const saldo = totalRecebido - totalPago;

    return NextResponse.json({
      contasRecebidas: totalRecebido,
      contasPagas: totalPago,
      saldo,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo do fluxo de caixa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
