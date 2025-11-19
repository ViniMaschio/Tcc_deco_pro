import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { clienteSchema } from "../types";

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
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
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
    const parsedBody = clienteSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const data = parsedBody.data;

    const exists = await db.cliente.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const updated = await db.cliente.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/cliente/:id error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
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
      return NextResponse.json({ error: "ID inválido", details: parsedId.error.issues }, { status: 400 });
    }

    const { id: clienteId } = parsedId.data;

    const cliente = await db.cliente.findFirst({
      where: { id: clienteId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    if (cliente.deleted) {
      return NextResponse.json({ error: "Cliente já deletado" }, { status: 400 });
    }

    await db.cliente.update({
      where: { id: clienteId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ id: clienteId }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/cliente/:id error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
