import { NextRequest, NextResponse } from "next/server";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const [contasReceber, contasPagar] = await Promise.all([
      db.contaReceber.findMany({
        where: {
          empresaId,
          deleted: false,
          status: {
            in: ["PENDENTE"],
          },
        },
        select: {
          valor: true,
          id: true,
          caixaEntradas: {
            where: {
              deleted: false,
            },
            select: {
              valor: true,
            },
          },
        },
      }),
      db.contaPagar.findMany({
        where: {
          empresaId,
          deleted: false,
          status: {
            in: ["PENDENTE"],
          },
        },
        select: {
          valor: true,
          id: true,
          caixaSaidas: {
            where: {
              deleted: false,
            },
            select: {
              valor: true,
            },
          },
        },
      }),
    ]);

    const totalReceber = contasReceber.reduce((acc, conta) => {
      const valorPago = conta.caixaEntradas.reduce((sum, caixa) => sum + caixa.valor, 0);
      return acc + (conta.valor - valorPago);
    }, 0);
    const totalPagar = contasPagar.reduce((acc, conta) => {
      const valorPago = conta.caixaSaidas.reduce((sum, caixa) => sum + caixa.valor, 0);
      return acc + (conta.valor - valorPago);
    }, 0);
    const saldo = totalReceber - totalPagar;

    return NextResponse.json({
      contasReceber: totalReceber,
      contasPagar: totalPagar,
      saldo,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo financeiro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

