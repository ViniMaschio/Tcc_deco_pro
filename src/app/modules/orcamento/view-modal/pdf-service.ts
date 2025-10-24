import { obterEmpresa } from "@/actions/empresa";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { formatCurrency } from "@/utils/currency";
import { Orcamento } from "@/app/api/orcamento/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";

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

    // Cria o PDF diretamente com jsPDF (sem html2canvas)
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    let yPosition = 20;

    // Cores
    const primaryColor = "#000000";
    const textColor = "#000000";
    const lightGray = "#F5F5F5";

    // Função para adicionar texto
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      pdf.setFontSize(options.fontSize || 12);
      pdf.setTextColor(options.color || textColor);
      pdf.setFont(options.font || "helvetica", options.style || "normal");
      pdf.text(text, x, y);
      return (pdf.getTextWidth(text) * (options.fontSize || 12)) / 12;
    };

    // Função para adicionar linha
    const addLine = (x1: number, y1: number, x2: number, y2: number, color: string = textColor) => {
      pdf.setDrawColor(color);
      pdf.line(x1, y1, x2, y2);
    };

    // Cabeçalho - Logo e dados da empresa
    // Logo (simulado com texto estilizado)
    addText("🏢", 20, yPosition, { fontSize: 24, color: primaryColor });
    addText("Era uma vez...", 35, yPosition, {
      fontSize: 14,
      color: primaryColor,
      style: "italic",
    });
    addText("Buffet e Eventos", 35, yPosition + 5, { fontSize: 12, color: primaryColor });

    // Dados da empresa (lado direito)
    const empresaData = [
      empresa.email || "Email não informado",
      `CNPJ ${empresa.cnpj || "CNPJ não informado"}`,
      empresa.telefone ? `Tel: ${empresa.telefone}` : "Telefone não informado",
      empresa.rua && empresa.numero
        ? `${empresa.rua}, ${empresa.numero}`
        : "Endereço não informado",
      empresa.cidade && empresa.estado
        ? `${empresa.cidade} - ${empresa.estado}`
        : "Cidade não informada",
      empresa.cep ? `CEP: ${empresa.cep}` : "CEP não informado",
    ].filter(Boolean);

    empresaData.forEach((line, index) => {
      addText(line, 120, yPosition + index * 4, { fontSize: 10 });
    });

    yPosition += 30;

    // Título do orçamento
    addText("ORÇAMENTO", pageWidth / 2, yPosition, {
      fontSize: 18,
      style: "bold",
      color: primaryColor,
    });
    yPosition += 15;

    // Dados do cliente e evento
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

    clienteInfo.forEach((line) => {
      if (line) {
        addText(line, 20, yPosition, { fontSize: 11 });
        yPosition += 5;
      }
    });

    yPosition += 10;

    // Tabela de itens
    if (orcamento.itens && orcamento.itens.length > 0) {
      // Cabeçalho da tabela
      const tableHeaders = ["Item", "Qtd", "Valor Unit.", "Desconto", "Total"];
      const columnWidths = [80, 20, 30, 30, 30];
      let xPosition = 20;

      // Linha de cabeçalho
      addLine(20, yPosition - 2, 190, yPosition - 2, primaryColor);
      addLine(20, yPosition + 8, 190, yPosition + 8, primaryColor);

      tableHeaders.forEach((header, index) => {
        addText(header, xPosition, yPosition + 5, {
          fontSize: 10,
          style: "bold",
          color: primaryColor,
        });
        xPosition += columnWidths[index];
      });

      yPosition += 10;

      // Itens da tabela
      orcamento.itens.forEach((item, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        xPosition = 20;
        const itemData = [
          item.nome,
          item.quantidade.toString(),
          formatCurrency(item.valorUnit),
          formatCurrency(item.desconto),
          formatCurrency(item.valorTotal),
        ];

        itemData.forEach((data, colIndex) => {
          addText(data, xPosition, yPosition, { fontSize: 9 });
          xPosition += columnWidths[colIndex];
        });

        // Linha separadora
        if (orcamento.itens && index < orcamento.itens.length - 1) {
          addLine(20, yPosition + 3, 190, yPosition + 3, "#E0E0E0");
        }

        yPosition += 6;
      });

      yPosition += 10;
    }

    // Resumo financeiro
    addLine(20, yPosition, 190, yPosition, primaryColor);
    yPosition += 5;

    addText("TOTAL DO ORÇAMENTO:", 20, yPosition, { fontSize: 12, style: "bold" });
    addText(formatCurrency(orcamento.total), 150, yPosition, {
      fontSize: 14,
      style: "bold",
      color: "#059669",
    });
    yPosition += 8;

    if (orcamento.desconto && orcamento.desconto > 0) {
      addText("Desconto adicional:", 20, yPosition, { fontSize: 10 });
      addText(`-${formatCurrency(orcamento.desconto)}`, 150, yPosition, {
        fontSize: 10,
        color: "#dc2626",
      });
      yPosition += 5;
    }

    // Observações
    if (orcamento.observacao) {
      yPosition += 10;
      addText("OBSERVAÇÕES:", 20, yPosition, { fontSize: 11, style: "bold" });
      yPosition += 5;
      addText(orcamento.observacao, 20, yPosition, { fontSize: 10 });
    }

    // Data e local
    yPosition = pageHeight - 30;
    const dataAtual = format(new Date(), "dd/MM/yyyy", { locale: ptBR });
    const local = empresa.cidade || "Local não informado";
    addText(`${local} ${dataAtual}`, 20, yPosition, { fontSize: 10 });

    // Assinatura
    yPosition += 15;
    addLine(20, yPosition, 100, yPosition, textColor);
    addText("Assinatura", 20, yPosition + 5, { fontSize: 9 });

    // Retorna o PDF como blob
    return pdf.output("blob");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
