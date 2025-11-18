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
            in: ["PENDENTE", "PARCIAL"],
          },
        },
        select: {
          valorTotal: true,
          valorPago: true,
        },
      }),
      db.contaPagar.findMany({
        where: {
          empresaId,
          deleted: false,
          status: {
            in: ["PENDENTE", "PARCIAL"],
          },
        },
        select: {
          valorTotal: true,
          valorPago: true,
        },
      }),
    ]);

    const totalReceber = contasReceber.reduce(
      (acc, conta) => acc + (conta.valorTotal - conta.valorPago),
      0
    );
    const totalPagar = contasPagar.reduce(
      (acc, conta) => acc + (conta.valorTotal - conta.valorPago),
      0
    );
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

