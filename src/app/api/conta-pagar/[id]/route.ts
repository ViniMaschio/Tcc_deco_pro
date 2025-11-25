import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { contaPagarSchema } from "../types";

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
    const parsedBody = contaPagarSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const data = parsedBody.data;

    const exists = await db.contaPagar.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 });
    }

    const dataToUpdate: {
      fornecedorId?: number | null;
      descricao?: string;
      dataVencimento?: Date;
      dataPagamento?: Date;
      valor: number;
      status: "PENDENTE" | "FINALIZADO";
    } = {
      ...data,
      dataVencimento: data.dataVencimento
        ? new Date(data.dataVencimento + "T00:00:00.000Z")
        : undefined,
      dataPagamento: data.dataPagamento
        ? new Date(data.dataPagamento + "T00:00:00.000Z")
        : undefined,
    };

    if (data.fornecedorId !== undefined) {
      dataToUpdate.fornecedorId = data.fornecedorId ?? null;
    }

    const updatedRaw = await db.contaPagar.update({
      where: { id },
      data: dataToUpdate,
      include: {
        fornecedor: {
          select: {
            id: true,
            nome: true,
          },
        },
        caixaSaidas: {
          where: {
            deleted: false,
          },
          select: {
            valor: true,
          },
        },
      },
    });

    const valorPago = updatedRaw.caixaSaidas.reduce(
      (acc: number, caixa: { valor: number }) => acc + caixa.valor,
      0
    );
    const valorRestante = updatedRaw.valor - valorPago;
    const updated = {
      ...updatedRaw,
      valorPago,
      valorRestante,
      valorTotal: updatedRaw.valor,
      caixaSaidas: undefined,
    };

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/conta-pagar/:id error:", err);
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

    const { id: contaPagarId } = parsedId.data;

    const contaPagar = await db.contaPagar.findFirst({
      where: { id: contaPagarId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!contaPagar) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 });
    }

    if (contaPagar.deleted) {
      return NextResponse.json({ error: "Conta a pagar já deletada" }, { status: 400 });
    }

    await db.contaPagar.update({
      where: { id: contaPagarId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ id: contaPagarId }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/conta-pagar/:id error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
