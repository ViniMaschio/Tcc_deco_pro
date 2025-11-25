import { NextRequest, NextResponse } from "next/server";
import { generateContratoPDF } from "@/app/modules/contrato/view-modal/pdf-service";
import { obterContrato } from "@/app/api/contrato/[id]/route";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const contratoId = parseInt((await params).id);

    if (isNaN(contratoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const contratoResult = await obterContrato(contratoId);
    if (!contratoResult.ok) {
      return NextResponse.json(
        { error: contratoResult.error || "Contrato não encontrado" },
        { status: 404 }
      );
    }

    const contrato = contratoResult.data;
    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    const pdfBlob = await generateContratoPDF(contrato, `contrato-${contrato.id}`);

    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrato-${contrato.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
