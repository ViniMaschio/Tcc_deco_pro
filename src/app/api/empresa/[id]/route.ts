import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";
import { empresaUpdateSchema } from "@/app/modules/orcamento/view-modal/schemas";

const idParamSchema = z.object({
  id: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive()),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { empresa: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const params = await ctx.params;
    const parsedId = idParamSchema.safeParse(params);
    if (!parsedId.success) {
      return NextResponse.json(
        { empresa: null, message: "ID inválido", errors: parsedId.error.issues },
        { status: 400 }
      );
    }
    const { id } = parsedId.data;

    if (id !== empresaId) {
      return NextResponse.json(
        { empresa: null, message: "Não autorizado a atualizar esta empresa!" },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsedBody = empresaUpdateSchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { empresa: null, message: "Dados inválidos", errors: parsedBody.error.issues },
        { status: 400 }
      );
    }

    const data = parsedBody.data;

    const exists = await db.empresa.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json(
        { empresa: null, message: "Empresa não encontrada!" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.senha !== undefined) updateData.senha = data.senha;
    if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
    if (data.razaoSocial !== undefined) updateData.razaoSocial = data.razaoSocial;
    if (data.rua !== undefined) updateData.rua = data.rua;
    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.complemento !== undefined) updateData.complemento = data.complemento ?? null;
    if (data.bairro !== undefined) updateData.bairro = data.bairro;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.cep !== undefined) updateData.cep = data.cep;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl ?? null;

    const updated = await db.empresa.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        razaoSocial: true,
        email: true,
        telefone: true,
        cnpj: true,
        rua: true,
        numero: true,
        complemento: true,
        bairro: true,
        cidade: true,
        cep: true,
        estado: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { empresa: updated, message: "Empresa atualizada com sucesso!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/empresa/:id error:", err);

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "campo único";
        return NextResponse.json(
          { empresa: null, message: `Valor já existe para ${target}.` },
          { status: 409 }
        );
      }
      if (err.code === "P2025") {
        return NextResponse.json(
          { empresa: null, message: "Empresa não encontrada!" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { empresa: null, message: "Erro ao atualizar empresa" },
      { status: 500 }
    );
  }
}
