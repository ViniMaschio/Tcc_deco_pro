import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { localSchema } from "../types";

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
    const parsedBody = localSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsedBody.error.issues },
        { status: 400 }
      );
    }
    const data = parsedBody.data;

    const exists = await db.localEvento.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "Local não encontrado" }, { status: 404 });
    }

    const updated = await db.localEvento.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/local/:id error:", err);
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
      return NextResponse.json({ error: "ID inválido", details: parsedId.error.issues }, { status: 400 });
    }

    const { id: localId } = parsedId.data;

    const local = await db.localEvento.findFirst({
      where: { id: localId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!local) {
      return NextResponse.json({ error: "Local não encontrado" }, { status: 404 });
    }

    if (local.deleted) {
      return NextResponse.json({ error: "Local já deletado" }, { status: 400 });
    }

    await db.localEvento.update({
      where: { id: localId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ id: localId }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/local/:id error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
