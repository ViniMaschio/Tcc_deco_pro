import { NextRequest, NextResponse } from "next/server";
import { generateOrcamentoPDF } from "@/app/modules/orcamento/view-modal/pdf-service";
import { obterOrcamento } from "@/app/api/orcamento/[id]/route";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orcamentoId = parseInt((await params).id);

    if (isNaN(orcamentoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }


    const orcamentoResult = await obterOrcamento(orcamentoId);
    if (!orcamentoResult.ok) {
      return NextResponse.json(
        { error: orcamentoResult.error || "Orçamento não encontrado" },
        { status: 404 }
      );
    }

    const orcamento = orcamentoResult.data;
    if (!orcamento) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 });
    }


    const pdfBlob = await generateOrcamentoPDF(orcamento, `orcamento-${orcamento.id}`);


    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orcamento-${orcamento.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
