import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

import { localSchema } from "../types";

const idParamSchema = z.object({
  id: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive()),
});

async function ensureEmpresaId() {
  const session = await getServerSession(authOptions);
  const num = Number(session?.user?.id);
  return Number.isFinite(num) ? num : null;
}

// ATUALIZAR LOCAL
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { local: null, message: "Não autenticado" },
        { status: 401 },
      );
    }

    const parsedId = idParamSchema.safeParse(ctx.params);
    if (!parsedId.success) {
      return NextResponse.json(
        { local: null, errors: z.treeifyError(parsedId.error) },
        { status: 400 },
      );
    }
    const { id } = parsedId.data;

    const json = await req.json();
    const parsedBody = localSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { local: null, errors: z.treeifyError(parsedBody.error) },
        { status: 400 },
      );
    }
    const data = parsedBody.data;

    const exists = await db.localEvento.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json(
        { local: null, message: "Local não encontrado!" },
        { status: 404 },
      );
    }

    const updated = await db.localEvento.update({
      where: { id },
      data,
    });

    return NextResponse.json(
      { local: updated, message: "Local atualizado com sucesso!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /api/local/:id error:", err);
    return NextResponse.json(
      { local: null, message: "Erro ao atualizar local" },
      { status: 500 },
    );
  }
}

// DELETAR LOCAL
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }, // 👈 aqui
) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { message: "Usuário não autenticado!" },
        { status: 401 },
      );
    }

    const { id } = await ctx.params; // 👈 e aqui
    const parsedId = idParamSchema.safeParse({ id });
    if (!parsedId.success) {
      return NextResponse.json({ errors: parsedId.error }, { status: 400 });
    }

    const { id: localId } = parsedId.data;

    const local = await db.localEvento.findFirst({
      where: { id: localId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!local) {
      return NextResponse.json(
        { message: "Local não encontrado!" },
        { status: 404 },
      );
    }

    if (local.deleted) {
      return NextResponse.json(
        { message: "Local já deletado!" },
        { status: 200 },
      );
    }

    await db.localEvento.update({
      where: { id: localId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Local removido com sucesso!", id: localId },
      { status: 200 },
    );
  } catch (err) {
    console.error("PATCH /api/local/:id error:", err);
    return NextResponse.json(
      { message: "Erro ao deletar o Local!" },
      { status: 500 },
    );
  }
}
