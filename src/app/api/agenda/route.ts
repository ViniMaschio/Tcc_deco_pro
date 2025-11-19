import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

const querySchema = z.object({
  month: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1).max(12))
    .optional(),
  year: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(2000))
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const now = new Date();
    const month = parsed.data.month ?? now.getMonth() + 1;
    const year = parsed.data.year ?? now.getFullYear();


    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);


    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);


    const contratos = await db.contrato.findMany({
      where: {
        empresaId,
        deleted: false,
        dataEvento: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            descricao: true,
          },
        },
      },
    });


    const orcamentos = await db.orcamento.findMany({
      where: {
        empresaId,
        deleted: false,
        dataEvento: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            descricao: true,
          },
        },
      },
    });


    const events = [
      ...contratos.map((contrato) => {
        const dataEvento = new Date(contrato.dataEvento);
        const horaInicio = new Date(contrato.horaInicio);
        const endDate = new Date(dataEvento);
        endDate.setHours(horaInicio.getHours(), horaInicio.getMinutes(), 0, 0);

        if (horaInicio.getHours() === 0 && horaInicio.getMinutes() === 0) {
          endDate.setHours(23, 59, 59, 999);
        }

        return {
          id: `contrato-${contrato.id}`,
          title: `Contrato - ${contrato.cliente.nome}`,
          description: contrato.local?.descricao || "Contrato",
          start: dataEvento,
          end: endDate,
          color: "#8b5cf6", // Roxo para contratos
          type: "contrato" as const,
          meta: {
            contratoId: contrato.id,
            clienteNome: contrato.cliente.nome,
            localDescricao: contrato.local?.descricao,
          },
        };
      }),
      ...orcamentos
        .filter((orcamento) => orcamento.dataEvento) // Apenas orçamentos com data
        .map((orcamento) => {
          const dataEvento = new Date(orcamento.dataEvento!);
          const endDate = new Date(dataEvento);
          endDate.setHours(23, 59, 59, 999);

          return {
            id: `orcamento-${orcamento.id}`,
            title: `Orçamento - ${orcamento.cliente.nome}`,
            description: orcamento.local?.descricao || "Orçamento",
            start: dataEvento,
            end: endDate,
            color: "#f59e0b", // Laranja para orçamentos
            type: "orcamento" as const,
            meta: {
              orcamentoId: orcamento.id,
              clienteNome: orcamento.cliente.nome,
              localDescricao: orcamento.local?.descricao,
            },
          };
        }),
    ];

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("GET /api/agenda error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
