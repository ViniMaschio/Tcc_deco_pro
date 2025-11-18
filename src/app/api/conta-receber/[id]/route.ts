import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { contaReceberSchema } from "../types";

const idParamSchema = z.object({
  id: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive()),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const parsedId = idParamSchema.safeParse(resolvedParams);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "ID inválido", details: parsedId.error.issues },
        { status: 400 }
      );
    }
    const { id } = parsedId.data;

    const json = await request.json();
    const parsedBody = contaReceberSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const data = parsedBody.data;

    const exists = await db.contaReceber.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 });
    }

    const dataToUpdate = {
      ...data,
      valorRestante: data.valorRestante ?? data.valorTotal - data.valorPago,
      dataVencimento: data.dataVencimento
        ? new Date(data.dataVencimento + "T00:00:00.000Z")
        : undefined,
      dataPagamento: data.dataPagamento
        ? new Date(data.dataPagamento + "T00:00:00.000Z")
        : undefined,
    };

    const updated = await db.contaReceber.update({
      where: { id },
      data: dataToUpdate,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/conta-receber/:id error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const parsedId = idParamSchema.safeParse({ id });
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "ID inválido", details: parsedId.error.issues },
        { status: 400 }
      );
    }

    const { id: contaReceberId } = parsedId.data;

    const contaReceber = await db.contaReceber.findFirst({
      where: { id: contaReceberId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!contaReceber) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 });
    }

    if (contaReceber.deleted) {
      return NextResponse.json({ error: "Conta a receber já deletada" }, { status: 400 });
    }

    await db.contaReceber.update({
      where: { id: contaReceberId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ id: contaReceberId }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/conta-receber/:id error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
