import { obterEmpresa } from "@/actions/empresa";
import { Orcamento } from "@/app/api/orcamento/types";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateOrcamentoPDF(orcamento: Orcamento, fileName: string = "orcamento") {
  try {
    // Obtém dados da empresa
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      throw new Error("Empresa não encontrada");
    }

    const empresaResult = await obterEmpresa(empresaId);
    if (!empresaResult.ok) {
      throw new Error("Erro ao obter dados da empresa");
    }

    const empresa = empresaResult.data;

    //const pdf = new jsPDF("p", "mm", "a4");
    let pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      precision: 10,
      compress: true,
    });

    const primaryColor = "#000000";
    const lightGray = "#F5F5F5";

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
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        cellPadding: 1,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      // footStyles: { fillColor: [211, 211, 211], textColor: [64, 64, 64], fontSize: 9 },
      // headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 12 },
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

    // === DADOS DO CLIENTE ===
    const clienteInfo = [
      `Cliente: ${orcamento.cliente?.nome || "Não informado"}`,
      orcamento.cliente?.telefone ? `Telefone: ${orcamento.cliente.telefone}` : null,
      orcamento.cliente?.email ? `Email: ${orcamento.cliente.email}` : null,
      orcamento.local ? `Local: ${orcamento.local.descricao}` : null,
      orcamento.categoriaFesta ? `Categoria: ${orcamento.categoriaFesta.descricao}` : null,
      orcamento.dataEvento
        ? `Data do Evento: ${format(new Date(orcamento.dataEvento), "dd/MM/yyyy", { locale: ptBR })}`
        : null,
    ].filter(Boolean);

    const clienteStartY = (pdf as any).lastAutoTable.finalY + 10;

    autoTable(pdf, {
      head: [
        [{ content: "Dados do Cliente", colSpan: 2, styles: { halign: "center", fontSize: 14 } }],
      ],
      body: clienteInfo.map((item) => [item]),
      startY: clienteStartY,
      styles: { fontSize: 11, cellPadding: 1.2 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    // === TABELA DE ITENS ===
    if (orcamento.itens && orcamento.itens.length > 0) {
      const itensStartY = (pdf as any).lastAutoTable.finalY + 10;

      const tableHeaders = ["Item", "Qtd", "Valor Unit.", "Desconto", "Total"];
      const tableData = orcamento.itens.map((item) => [
        item.nome || "",
        item.quantidade || 0,
        `R$ ${(item.valorUnit || 0).toFixed(2)}`,
        `${item.desconto ? item.desconto + "%" : "-"}`,
        `R$ ${(item.valorTotal || 0).toFixed(2)}`,
      ]);

      autoTable(pdf, {
        head: [tableHeaders],
        body: tableData,
        startY: itensStartY,
        styles: { fontSize: 10, cellPadding: 1 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        theme: "grid",
      });
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
