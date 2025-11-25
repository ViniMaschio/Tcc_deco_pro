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

    // Buscar a entrada no caixa
    const caixaEntrada = await db.caixaEntrada.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
      include: {
        contaReceber: true,
      },
    });

    if (!caixaEntrada) {
      return NextResponse.json({ error: "Entrada no caixa não encontrada" }, { status: 404 });
    }

    // Deletar a entrada no caixa (soft delete)
    await db.caixaEntrada.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    // Atualizar o status da conta a receber para PENDENTE
    if (caixaEntrada.contasReceberId) {
      await db.contaReceber.update({
        where: { id: caixaEntrada.contasReceberId },
        data: {
          status: "PENDENTE",
          dataPagamento: null,
        },
      });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/caixa-entrada/:id error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
