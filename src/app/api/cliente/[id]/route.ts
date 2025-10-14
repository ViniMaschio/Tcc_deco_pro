import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

import { clienteSchema } from "../types";

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

// ATUALIZAR Cliente
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { local: null, message: "Usuário não autenticado!" },
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
    const parsedBody = clienteSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { local: null, errors: z.treeifyError(parsedBody.error) },
        { status: 400 },
      );
    }

    const data = parsedBody.data;

    const exists = await db.cliente.findFirst({
      where: { id, empresaId, deleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json(
        { local: null, message: "Cliente não encontrado!" },
        { status: 404 },
      );
    }

    const updated = await db.cliente.update({
      where: { id },
      data,
    });

    return NextResponse.json(
      { local: updated, message: "Cliente atualizado com sucesso!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /api/cliente/:id error:", err);
    return NextResponse.json(
      { local: null, message: "Erro ao atualizar cliente" },
      { status: 500 },
    );
  }
}

// DELETAR CLIENTE
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { message: "Usuário não autenticado!" },
        { status: 401 },
      );
    }

    const { id } = await ctx.params;
    const parsedId = idParamSchema.safeParse({ id });
    if (!parsedId.success) {
      return NextResponse.json({ errors: parsedId.error }, { status: 400 });
    }

    const { id: clienteId } = parsedId.data;

    const cliente = await db.cliente.findFirst({
      where: { id: clienteId, empresaId },
      select: { id: true, deleted: true },
    });

    if (!cliente) {
      return NextResponse.json(
        { message: "Cliente não encontrado!" },
        { status: 404 },
      );
    }

    if (cliente.deleted) {
      return NextResponse.json(
        { message: "Cliente já deletado!" },
        { status: 200 },
      );
    }

    await db.cliente.update({
      where: { id: clienteId },
      data: { deleted: true, deletedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Cliente removido com sucesso!", id: clienteId },
      { status: 200 },
    );
  } catch (err) {
    console.error("PATCH /api/cliente/:id error:", err);
    return NextResponse.json(
      { message: "Erro ao deletar o Cliente!" },
      { status: 500 },
    );
  }
}
