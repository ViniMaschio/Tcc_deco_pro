import { obterEmpresa } from "@/actions/empresa";
import { Contrato } from "@/app/api/contrato/types";
import { StatusLabelEnum } from "@/app/modules/contrato/enum";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
const SAO_PAULO_TZ = "America/Sao_Paulo";

const toZonedDate = (value?: Date | string | null) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toZonedTime(date, SAO_PAULO_TZ);
};

export async function generateContratoPDF(contrato: Contrato, fileName: string = "contrato") {
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

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      precision: 10,
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginX = 14;
    let cursorY = 0;

    const drawSectionHeader = (label: string) => {
      pdf.setFillColor(238, 238, 238);
      pdf.setDrawColor(255, 255, 255);
      pdf.rect(marginX, cursorY, pageWidth - marginX * 2, 8, "F");
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(44, 44, 44);
      pdf.text(label.toUpperCase(), marginX + 2, cursorY + 5.6);
      cursorY += 12;
    };

    const drawKeyValueTable = (rows: RowInput[], options?: { columnWidths?: number[] }) => {
      autoTable(pdf, {
        body: rows,
        startY: cursorY,
        theme: "plain",
        styles: {
          fontSize: 10,
          lineWidth: 0.1,
          cellPadding: 2.5,
          textColor: [55, 65, 81],
        },
        columnStyles: {
          0: {
            cellWidth: options?.columnWidths?.[0] ?? 47,
            fillColor: [248, 250, 252],
            textColor: [15, 23, 42],
            fontStyle: "bold",
          },
          1: { cellWidth: options?.columnWidths?.[1] ?? "auto" },
          2: { cellWidth: options?.columnWidths?.[2] ?? "auto" },
        },
        margin: { left: marginX, right: marginX },
        didDrawPage: handleAutoTableDrawPage,
      });
      cursorY = (pdf as any).lastAutoTable.finalY + 8;
    };

    const measureTextWidth = (text: string) => pdf.getTextWidth(text);

    const contentWidth = pageWidth - marginX * 2;
    const lineHeight = 4.6;
    const ensureLineSpace = (height: number = lineHeight) => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (cursorY + height > pageHeight - 20) {
        addPageWithHeader();
      }
    };

    type JustifiedLine = { text: string; width: number; x: number };

    const buildJustifiedLines = (
      text: string,
      firstLineWidth: number,
      subsequentWidth: number,
      firstLineX: number,
      subsequentX: number
    ): JustifiedLine[] => {
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length === 0) return [];
      const lines: JustifiedLine[] = [];
      let currentLine = "";
      let currentWidthLimit = firstLineWidth;
      let currentX = firstLineX;

      const pushLine = () => {
        if (currentLine.trim().length === 0) return;
        lines.push({ text: currentLine, width: currentWidthLimit, x: currentX });
      };

      words.forEach((word) => {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (measureTextWidth(candidate) <= currentWidthLimit) {
          currentLine = candidate;
        } else {
          pushLine();
          currentLine = word;
          currentWidthLimit = subsequentWidth;
          currentX = subsequentX;
        }
      });

      pushLine();
      return lines;
    };

    const drawJustifiedLines = (lines: JustifiedLine[], extraSpacing = 2) => {
      lines.forEach((line, index) => {
        ensureLineSpace();
        const isLast = index === lines.length - 1;
        if (line.text.length <= 1 || isLast) {
          pdf.text(line.text, line.x, cursorY);
        } else {
          const textWidth = measureTextWidth(line.text);
          const gap = line.width - textWidth;
          const charSpace = gap > 0 ? gap / Math.max(line.text.length - 1, 1) : 0;
          pdf.text(line.text, line.x, cursorY, { charSpace });
        }
        cursorY += lineHeight;
      });
      cursorY += extraSpacing;
    };

    const drawJustifiedParagraph = (text: string) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const lines = buildJustifiedLines(text, contentWidth, contentWidth, marginX, marginX);
      drawJustifiedLines(lines);
    };

    const drawParagraph = (text: string) => drawJustifiedParagraph(text);

    const logoSize = 28;
    let logoImage: { data: string; format: "PNG" | "JPEG" } | null = null;
    if (empresa.logoUrl) {
      try {
        const logoResponse = await fetch(empresa.logoUrl);
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          const buffer = Buffer.from(await logoBlob.arrayBuffer());
          const contentType = logoBlob.type || "image/png";
          const imageFormat: "PNG" | "JPEG" = contentType.includes("jpeg") ? "JPEG" : "PNG";
          logoImage = {
            data: `data:${contentType};base64,${buffer.toString("base64")}`,
            format: imageFormat,
          };
        }
      } catch (error) {
        console.warn("Erro ao carregar logo:", error);
      }
    }

    const headerTop = 18;
    const headerBottom = headerTop + 28;
    const renderedHeaderPages = new Set<number>();
    const resolvePageNumber = (doc: jsPDF) => {
      const infoGetter = (doc as any).getCurrentPageInfo;
      if (typeof infoGetter === "function") {
        return infoGetter.call(doc).pageNumber;
      }
      return doc.getNumberOfPages();
    };

    const drawHeaderForPage = (doc: jsPDF) => {
      const pageNumber = resolvePageNumber(doc);
      if (renderedHeaderPages.has(pageNumber)) return;
      renderedHeaderPages.add(pageNumber);

      if (logoImage) {
        doc.addImage(logoImage.data, logoImage.format, marginX, headerTop - 8, logoSize, logoSize);
      }

      doc.setTextColor(51, 51, 51);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(empresa.nome ?? "Minha Empresa", pageWidth - marginX, headerTop, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const headerLines = [
        empresa.email ? `Email: ${empresa.email}` : null,
        empresa.telefone ? `Tel: ${empresa.telefone}` : null,
      ].filter(Boolean) as string[];
      headerLines.forEach((line, index) => {
        doc.text(line, pageWidth - marginX, headerTop + 6 + index * 4, { align: "right" });
      });

      doc.setDrawColor(229, 231, 235);
    };

    drawHeaderForPage(pdf);
    cursorY = headerBottom;
    const handleAutoTableDrawPage = ({ doc }: { doc: jsPDF }) => {
      drawHeaderForPage(doc);
    };
    const addPageWithHeader = () => {
      pdf.addPage();
      drawHeaderForPage(pdf);
      cursorY = headerBottom;
    };

    // Título
    const refText = contrato.orcamento?.uuid
      ? `Ref. Orçamento Nº: ${contrato.orcamento.uuid}`
      : `Contrato Nº: ${contrato.id}`;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(`CONTRATO`, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 10;

    const nowZoned = toZonedDate(new Date())!;
    const dataGeracao = format(toZonedDate(contrato.createdAt) ?? nowZoned, "dd/MM/yyyy", {
      locale: ptBR,
    });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Documento gerado em ${dataGeracao}`, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 12;

    // Seção Detalhes
    drawSectionHeader("Detalhes da Contratação");
    drawKeyValueTable([
      [
        { content: "Contratada" },
        { content: empresa.nome ?? "-" },
        { content: empresa.cnpj ? `CNPJ: ${empresa.cnpj}` : "" },
      ],
      [
        { content: "Contratante" },
        { content: contrato.cliente?.nome ?? "-" },
        { content: contrato.cliente?.cpf ? `CPF: ${contrato.cliente?.cpf}` : "" },
      ],
    ]);

    // Seção Evento
    const dataEventoDate = toZonedDate(contrato.dataEvento);
    const horaInicioDate = toZonedDate(contrato.horaInicio);
    const dataEvento = dataEventoDate
      ? format(dataEventoDate, "dd/MM/yyyy", { locale: ptBR })
      : "-";
    const horaInicio = horaInicioDate ? format(horaInicioDate, "HH:mm", { locale: ptBR }) : "-";

    drawSectionHeader("Informações do Evento");
    drawKeyValueTable(
      [
        [
          { content: "Local" },
          { content: contrato.local?.descricao ?? "Não informado", colSpan: 2 },
        ],
        [
          { content: "Categoria" },
          { content: contrato.categoriaFesta?.descricao ?? "-", colSpan: 2 },
        ],
        [{ content: "Data" }, { content: dataEvento }, { content: `Horário: ${horaInicio}` }],
      ],
      { columnWidths: [40, 70, 60] }
    );

    // Seção Itens
    if (contrato.itens && contrato.itens.length > 0) {
      drawSectionHeader("Itens do Contrato");

      const produtos: any[] = [];
      const servicos: any[] = [];
      let total = 0;
      contrato.itens.forEach((item) => {
        total += item.valorTotal ?? 0;
        const row = [
          item.item?.nome || "Item",
          item.quantidade || 0,
          formatCurrency(item.valorUnit),
          formatCurrency(item.desconto),
          formatCurrency(item.valorTotal),
        ];

        if (item.item?.tipo === "PRO") {
          produtos.push(row);
        } else {
          servicos.push(row);
        }
      });

      const columnStyles = {
        0: { cellWidth: 100, halign: "left" as const },
        1: { cellWidth: 10, halign: "right" as const },
        2: { cellWidth: 24, halign: "right" as const },
        3: { cellWidth: 24, halign: "right" as const },
        4: { cellWidth: 24, halign: "right" as const },
      };

      autoTable(pdf, {
        head: [
          [{ content: "Produtos", colSpan: 5, styles: { halign: "center" } }],
          ["Nome", "Qtd", "Valor Unit.", "Desconto", "Total"],
        ],
        body: produtos,
        startY: cursorY,
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
        margin: { left: marginX, right: marginX },
        didDrawPage: handleAutoTableDrawPage,
      });

      cursorY = (pdf as any).lastAutoTable.finalY + 6;

      autoTable(pdf, {
        head: [
          [{ content: "Serviços", colSpan: 5, styles: { halign: "center" } }],
          ["Nome", "Qtd", "Valor Unit.", "Desconto", "Total"],
        ],
        body: servicos,
        foot: [
          [
            {
              content: `Total Geral: ${formatCurrency(total)}`,
              colSpan: 5,
              styles: { halign: "right" },
            },
          ],
        ],
        startY: cursorY,
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
        margin: { left: marginX, right: marginX },
        didDrawPage: handleAutoTableDrawPage,
      });

      cursorY = (pdf as any).lastAutoTable.finalY + 10;
    }

    const formatAddress = (address?: {
      rua?: string | null;
      numero?: string | null;
      bairro?: string | null;
      cidade?: string | null;
      estado?: string | null;
    }) => {
      if (!address) return "não informado";
      const parts = [
        address.rua,
        address.numero,
        address.bairro,
        address.cidade,
        address.estado,
      ].filter((part) => part && part.trim().length > 0);
      return parts.length > 0 ? parts.join(", ") : "não informado";
    };

    const sanitizeText = (value?: string | null) =>
      value && value.trim().length > 0 ? value : "não informado";

    const contratanteResumo = `Nome/Razão Social: ${sanitizeText(
      contrato.cliente?.nome
    )}, inscrito(a) no CPF/CNPJ sob o nº ${sanitizeText(
      contrato.cliente?.cpf
    )}, com sede/residência em ${formatAddress(contrato.cliente)}, endereço eletrônico ${sanitizeText(
      contrato.cliente?.email
    )}, telefone ${sanitizeText(contrato.cliente?.telefone)}, neste ato representado(a) na forma de seus atos constitutivos ou por seu representante legal.`;

    const contratadaResumo = `Nome/Razão Social: ${sanitizeText(
      empresa.nome
    )}, inscrita no CNPJ sob o nº ${sanitizeText(empresa.cnpj)}, com sede em ${formatAddress(
      empresa
    )}, endereço eletrônico ${sanitizeText(empresa.email)}, telefone ${sanitizeText(
      empresa.telefone
    )}, neste ato representada na forma de seus atos constitutivos ou por seu representante legal.`;

    // Seção Cláusulas
    if (contrato.clausulas && contrato.clausulas.length > 0) {
      drawSectionHeader("Termos do Contrato");

      const drawPartyParagraph = (label: string, content: string) => {
        const labelText = `${label} `;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(30, 41, 59);
        const labelWidth = measureTextWidth(labelText);
        ensureLineSpace();
        pdf.text(labelText, marginX, cursorY);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(71, 85, 105);
        const firstLineWidth = Math.max(contentWidth - labelWidth, contentWidth * 0.4);
        const lines = buildJustifiedLines(
          content,
          firstLineWidth,
          contentWidth,
          marginX + labelWidth,
          marginX
        );
        drawJustifiedLines(lines);
      };

      cursorY += 4;
      pdf.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", pageWidth / 2, cursorY, { align: "center" });
      cursorY += 8;
      pdf.text("IDENTIFICAÇÃO DAS PARTES CONTRATANTES", pageWidth / 2, cursorY, {
        align: "center",
      });
      cursorY += 6;
      drawPartyParagraph("CONTRATANTE:", contratanteResumo);
      cursorY += 4;
      drawPartyParagraph("CONTRATADA:", contratadaResumo);
      cursorY += 6;

      contrato.clausulas
        .sort((a, b) => a.ordem - b.ordem)
        .forEach((clausula) => {
          if (cursorY > 260) {
            addPageWithHeader();
          }
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.setTextColor(30, 41, 59);
          pdf.text(
            clausula.titulo || `Cláusula ${clausula.ordem.toString().padStart(2, "0")}`,
            marginX,
            cursorY
          );
          cursorY += 6;
          pdf.setTextColor(71, 85, 105);
          drawParagraph(clausula.conteudo || "");
        });
    }

    const ensureSpace = (minSpace: number) => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (cursorY + minSpace > pageHeight - 20) {
        addPageWithHeader();
      }
    };

    ensureSpace(60);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(
      "ESTANDO AMBAS AS PARTES JUSTAS E CONTRATADAS, ASSINAM O PRESENTE CONTRATO EM DUAS VIAS DE IGUAL TEOR.",
      marginX,
      cursorY,
      { maxWidth: pageWidth - marginX * 2 }
    );
    cursorY += 14;

    const assinaturaDataDate = dataEventoDate ?? nowZoned;
    const assinaturaData = format(assinaturaDataDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const cidadeBase =
      contrato.cliente?.cidade && contrato.cliente?.estado
        ? `${contrato.cliente.cidade}, ${contrato.cliente.estado}`
        : empresa.cidade && empresa.estado
          ? `${empresa.cidade}, ${empresa.estado}`
          : "";

    if (cidadeBase) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`${cidadeBase}, ${assinaturaData}`, pageWidth - marginX, cursorY, {
        align: "right",
      });
      cursorY += 12;
    }

    const sectionWidth = (pageWidth - marginX * 2 - 20) / 2;
    const leftX = marginX;
    const rightX = marginX + sectionWidth + 20;

    const drawSignatureBlock = ({ x, label }: { x: number; label: string }) => {
      const lineY = cursorY + 12;
      pdf.setDrawColor(100, 116, 139);
      pdf.line(x, lineY, x + sectionWidth, lineY);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text(label, x + sectionWidth / 2, lineY + 6, { align: "center" });
    };

    drawSignatureBlock({
      x: leftX,
      label: "CONTRATADA",
    });
    drawSignatureBlock({
      x: rightX,
      label: "CONTRATANTE",
    });

    return pdf.output("blob");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
