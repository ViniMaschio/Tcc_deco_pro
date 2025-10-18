import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { CategoriaFestaResponse,UpdateCategoriaFestaRequest } from "../types";

const updateCategoriaFestaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CategoriaFestaResponse>> {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ categoriaFesta: null, message: "ID inválido!" }, { status: 400 });
    }

    const categoriaFesta = await db.categoriaFesta.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!categoriaFesta) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Categoria de festa não encontrada!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      categoriaFesta,
      message: "Categoria de festa encontrada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao buscar categoria de festa:", error);
    return NextResponse.json(
      { categoriaFesta: null, message: "Erro ao buscar categoria de festa!" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CategoriaFestaResponse>> {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ categoriaFesta: null, message: "ID inválido!" }, { status: 400 });
    }

    const body = await req.json();
    const parsedBody = updateCategoriaFestaSchema.parse(body);

    // Verificar se a categoria existe
    const existingCategoria = await db.categoriaFesta.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!existingCategoria) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Categoria de festa não encontrada!" },
        { status: 404 }
      );
    }

    const categoriaFestaAtualizada = await db.categoriaFesta.update({
      where: { id },
      data: parsedBody,
    });

    return NextResponse.json({
      categoriaFesta: categoriaFestaAtualizada,
      message: "Categoria de festa atualizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria de festa:", error);
    return NextResponse.json(
      { categoriaFesta: null, message: "Erro ao atualizar categoria de festa!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CategoriaFestaResponse>> {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({ categoriaFesta: null, message: "ID inválido!" }, { status: 400 });
    }

    // Verificar se a categoria existe
    const existingCategoria = await db.categoriaFesta.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!existingCategoria) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Categoria de festa não encontrada!" },
        { status: 404 }
      );
    }

    // Verificar se há orçamentos ou contratos vinculados
    const [orcamentosCount, contratosCount] = await Promise.all([
      db.orcamento.count({
        where: {
          categoriaId: id,
          deleted: false,
        },
      }),
      db.contrato.count({
        where: {
          categoriaId: id,
          deleted: false,
        },
      }),
    ]);

    if (orcamentosCount > 0 || contratosCount > 0) {
      return NextResponse.json(
        {
          categoriaFesta: null,
          message:
            "Não é possível excluir categoria que possui orçamentos ou contratos vinculados!",
        },
        { status: 400 }
      );
    }

    // Soft delete
    const categoriaFestaExcluida = await db.categoriaFesta.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      categoriaFesta: categoriaFestaExcluida,
      message: "Categoria de festa excluída com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao excluir categoria de festa:", error);
    return NextResponse.json(
      { categoriaFesta: null, message: "Erro ao excluir categoria de festa!" },
      { status: 500 }
    );
  }
}
