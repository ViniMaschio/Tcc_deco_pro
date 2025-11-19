import { obterEmpresa } from "@/actions/empresa";
import { Orcamento } from "@/app/api/orcamento/types";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateOrcamentoPDF(orcamento: Orcamento, fileName: string = "orcamento") {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      throw new Error("Empresa não encontrada");
    }

    const empresaResult = await obterEmpresa(empresaId);
    if (!empresaResult.ok) {
      throw new Error("Erro ao obter dados da empresa");
    }

    const empresa = empresaResult.data;

    let pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      precision: 10,
      compress: true,
    });

    const primaryColor = "#000000";
    const lightGray = "#F5F5F5";

    const logoBase64 = "data:image/png;base64,iVBORw0K...";

    const logoX = 10;
    const logoY = 10;
    const logoWidth = 30;
    const logoHeight = 30;

    autoTable(pdf, {
      body: [
        [{ content: `Empresa: ${empresa.nome ?? "Vinicius Ribiero Maschio"}`, colSpan: 3 }],
        [{ content: `CNPJ: ${empresa.cnpj ?? ""}`, colSpan: 3 }],
        [
          { content: `Telefone: ${empresa.telefone ?? ""}`, colSpan: 1 },
          { content: `Email: ${empresa.email ?? ""}`, colSpan: 2 },
        ],
        [
          { content: `Rua: ${empresa.rua ?? ""}`, colSpan: 1 },
          { content: `Numero: ${empresa.numero ?? ""}`, colSpan: 1 },
          { content: `Bairro: ${empresa.bairro ?? ""}`, colSpan: 1 },
        ],
        [
          { content: `Cidade: ${empresa.cidade ?? ""}`, colSpan: 1 },
          { content: `Estado: ${empresa.estado ?? ""}`, colSpan: 1 },
          { content: `CEP: ${empresa.cep ?? ""}`, colSpan: 1 },
        ],
      ],

      theme: "grid",
      styles: {
        fontSize: 12,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        cellPadding: 0.3,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0,
      },
      margin: { top: 10, left: 45 },
      startY: 10,
    });

    autoTable(pdf, {
      body: [
        [
          {
            content: `Orçamento gerado em ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`,
            colSpan: 2,
            styles: { halign: "center", fontSize: 10 },
          },
        ],
      ],
      theme: "plain",
      styles: {
        fillColor: [211, 211, 211],
        textColor: [64, 64, 64],
        fontSize: 9,
      },
      startY: (pdf as any).lastAutoTable?.finalY + 10,
    });

    autoTable(pdf, {
      head: [
        [{ content: "Dados do Cliente", colSpan: 3, styles: { halign: "center", fontSize: 14 } }],
      ],
      body: [
        [
          { content: `Nome: ${orcamento.cliente?.nome}`, colSpan: 2 },
          { content: `CPF: ${orcamento.cliente?.cpf ?? ""}`, colSpan: 1 },
        ],
        [
          { content: `Telefone: ${orcamento.cliente?.telefone ?? ""}`, colSpan: 1 },
          { content: `Email: ${orcamento.cliente?.email ?? ""}`, colSpan: 2 },
        ],
        [
          { content: `Rua: ${orcamento.cliente?.rua ?? ""}`, colSpan: 1 },
          { content: `Numero: ${orcamento.cliente?.numero ?? ""}`, colSpan: 1 },
          { content: `Bairro: ${orcamento.cliente?.bairro ?? ""}`, colSpan: 1 },
        ],
        [
          { content: `Cidade: ${orcamento.cliente?.cidade ?? ""}`, colSpan: 1 },
          { content: `Estado: ${orcamento.cliente?.estado ?? ""}`, colSpan: 1 },
          { content: `CEP: ${orcamento.cliente?.cep ?? ""}`, colSpan: 1 },
        ],
      ],
      startY: (pdf as any).lastAutoTable.finalY + 5,
      theme: "grid",
      styles: {
        fontSize: 12,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        cellPadding: 0.3,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    autoTable(pdf, {
      head: [
        [{ content: "Dados do Evento", colSpan: 2, styles: { halign: "center", fontSize: 14 } }],
      ],
      body: [
        [
          { content: `Local: ${orcamento.local?.descricao ?? ""}`, colSpan: 1 },
          { content: `Categoria Festa: ${orcamento.categoriaFesta?.descricao ?? ""}`, colSpan: 1 },
        ],
        [
          {
            content: `Data do Evento: ${orcamento.dataEvento}`,
            colSpan: 2,
          },
        ],
      ],
      startY: (pdf as any).lastAutoTable.finalY + 5,
      theme: "grid",
      styles: {
        fontSize: 12,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        cellPadding: 0.3,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    const produtos: any[] = [];
    const servicos: any[] = [];
    let total = 0;
    if (orcamento.itens && orcamento.itens.length > 0) {
      orcamento.itens.forEach((item) => {
        total += item.valorTotal;
        if (item.item?.tipo == "PRO") {
          produtos.push([
            item.nome || "",
            item.quantidade || 0,
            `R$ ${(item.valorUnit || 0).toFixed(2)}`,
            `${item.desconto ? item.desconto + "%" : "R$ 0.00"}`,
            `R$ ${(item.valorTotal || 0).toFixed(2)}`,
          ]);
        } else {
          servicos.push([
            item.nome || "",
            item.quantidade || 0,
            `R$ ${(item.valorUnit || 0).toFixed(2)}`,
            `${item.desconto ? item.desconto + "%" : "R$ 0.00"}`,
            `R$ ${(item.valorTotal || 0).toFixed(2)}`,
          ]);
        }
      });
    }
    const columnStyles = {
      0: { cellWidth: 100, halign: "left" as const },
      1: { cellWidth: 10, halign: "right" as const },
      2: { cellWidth: 24, halign: "right" as const },
      3: { cellWidth: 24, halign: "right" as const },
      4: { cellWidth: 24, halign: "right" as const },
    };

    autoTable(pdf, {
      head: [
        [
          {
            content: "Produtos",
            colSpan: 5,
            styles: { halign: "center" },
          },
        ],
        ["Nome", "Qtd", "Valor Unit.", "Desconto", "Total"],
      ],
      body: produtos,
      startY: (pdf as any).lastAutoTable.finalY + 10,
      styles: {
        fontSize: 10,
        cellPadding: 0.3,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      columnStyles,
      theme: "grid",
    });
    autoTable(pdf, {
      head: [
        [
          {
            content: "Servicos",
            colSpan: 5,
            styles: { halign: "center" },
          },
        ],
        ["Nome", "Qtd", "Valor Unit.", "Desconto", "Total"],
      ],
      body: servicos,
      foot: [
        [
          {
            content: `Total Geral: R$ ${total.toFixed(2)}`,
            colSpan: 5,
            styles: { halign: "right" },
          },
        ],
      ],
      startY: (pdf as any).lastAutoTable.finalY,
      styles: {
        fontSize: 10,
        cellPadding: 0.3,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      footStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
      columnStyles,
      theme: "grid",
    });

    return pdf.output("blob");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
