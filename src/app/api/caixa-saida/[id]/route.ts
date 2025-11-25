import { NextRequest, NextResponse } from "next/server";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Buscar a saída no caixa
    const caixaSaida = await db.caixaSaida.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
      include: {
        contaPagar: true,
      },
    });

    if (!caixaSaida) {
      return NextResponse.json({ error: "Saída no caixa não encontrada" }, { status: 404 });
    }

    // Deletar a saída no caixa (soft delete)
    await db.caixaSaida.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    // Atualizar o status da conta a pagar para PENDENTE
    if (caixaSaida.contasPagarId) {
      await db.contaPagar.update({
        where: { id: caixaSaida.contasPagarId },
        data: {
          status: "PENDENTE",
          dataPagamento: null,
        },
      });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/caixa-saida/:id error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
