import { obterEmpresa } from "@/actions/empresa";
import { Contrato } from "@/app/api/contrato/types";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

    let pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      precision: 10,
      compress: true,
    });

    const primaryColor = "#000000";
    const lightGray = "#F5F5F5";

    // Buscar e adicionar logo da empresa se existir
    let logoBase64: string | null = null;
    let logoWidth = 30;
    let logoHeight = 30;
    const startY = 10;
    const logoX = 10;
    const logoY = 10;

    if (empresa.logoUrl) {
      try {
        const logoResponse = await fetch(empresa.logoUrl);
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          const logoArrayBuffer = await logoBlob.arrayBuffer();
          const logoBuffer = Buffer.from(logoArrayBuffer);

          // Determinar o formato da imagem
          const contentType = logoBlob.type || "image/png";
          let imageFormat: "PNG" | "JPEG" = "PNG";
          if (contentType.includes("jpeg") || contentType.includes("jpg")) {
            imageFormat = "JPEG";
          }

          logoBase64 = `data:${contentType};base64,${logoBuffer.toString("base64")}`;

          // Dimensões padrão para logo (máximo 30mm de largura)
          const maxLogoSize = 30;
          logoWidth = maxLogoSize;
          logoHeight = maxLogoSize;

          // Adicionar logo ao lado esquerdo das informações da empresa (mesma altura)
          pdf.addImage(logoBase64, imageFormat, logoX, logoY, logoWidth, logoHeight);
        }
      } catch (error) {
        console.error("Erro ao carregar logo da empresa:", error);
        // Continua sem logo se houver erro
        logoBase64 = null;
      }
    }

    // Calcular margem esquerda da tabela baseado na presença da logo
    const tableLeftMarginFinal = logoBase64 ? logoWidth + 20 : 10;

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
      margin: { top: 10, left: tableLeftMarginFinal },
      startY: startY,
    });

    autoTable(pdf, {
      body: [
        [
          {
            content: `Contrato gerado em ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })}`,
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
          { content: `Nome: ${contrato.cliente?.nome}`, colSpan: 2 },
          { content: `CPF: ${contrato.cliente?.cpf ?? ""}`, colSpan: 1 },
        ],
        [
          { content: `Telefone: ${contrato.cliente?.telefone ?? ""}`, colSpan: 1 },
          { content: `Email: ${contrato.cliente?.email ?? ""}`, colSpan: 2 },
        ],
        [
          { content: `Rua: ${contrato.cliente?.rua ?? ""}`, colSpan: 1 },
          { content: `Numero: ${contrato.cliente?.numero ?? ""}`, colSpan: 1 },
          { content: `Bairro: ${contrato.cliente?.bairro ?? ""}`, colSpan: 1 },
        ],
        [
          { content: `Cidade: ${contrato.cliente?.cidade ?? ""}`, colSpan: 1 },
          { content: `Estado: ${contrato.cliente?.estado ?? ""}`, colSpan: 1 },
          { content: `CEP: ${contrato.cliente?.cep ?? ""}`, colSpan: 1 },
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

    const dataEventoFormatada = contrato.dataEvento
      ? format(new Date(contrato.dataEvento), "dd/MM/yyyy", { locale: ptBR })
      : "";
    const horaInicioFormatada = contrato.horaInicio
      ? format(new Date(contrato.horaInicio), "HH:mm", { locale: ptBR })
      : "";

    autoTable(pdf, {
      head: [
        [{ content: "Dados do Evento", colSpan: 2, styles: { halign: "center", fontSize: 14 } }],
      ],
      body: [
        [
          { content: `Local: ${contrato.local?.descricao ?? ""}`, colSpan: 1 },
          { content: `Categoria Festa: ${contrato.categoriaFesta?.descricao ?? ""}`, colSpan: 1 },
        ],
        [
          {
            content: `Data do Evento: ${dataEventoFormatada}`,
            colSpan: 1,
          },
          {
            content: `Hora de Início: ${horaInicioFormatada}`,
            colSpan: 1,
          },
        ],
        [
          {
            content: `Status: ${contrato.status}`,
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
    if (contrato.itens && contrato.itens.length > 0) {
      contrato.itens.forEach((item) => {
        total += item.valorTotal;
        if (item.item?.tipo == "PRO") {
          produtos.push([
            item.item.nome || "",
            item.quantidade || 0,
            `R$ ${(item.valorUnit || 0).toFixed(2)}`,
            `R$ ${(item.desconto || 0).toFixed(2)}`,
            `R$ ${(item.valorTotal || 0).toFixed(2)}`,
          ]);
        } else {
          servicos.push([
            item.item?.nome || "",
            item.quantidade || 0,
            `R$ ${(item.valorUnit || 0).toFixed(2)}`,
            `R$ ${(item.desconto || 0).toFixed(2)}`,
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

    // Adicionar cláusulas do contrato
    if (contrato.clausulas && contrato.clausulas.length > 0) {
      contrato.clausulas.forEach((clausula) => {
        // Verificar se precisa de nova página
        const currentY = (pdf as any).lastAutoTable?.finalY || 0;
        if (currentY > 250) {
          pdf.addPage();
        }

        autoTable(pdf, {
          head: [
            [
              {
                content: clausula.titulo || `Cláusula ${clausula.ordem}`,
                colSpan: 1,
                styles: { halign: "left", fontSize: 12, fontStyle: "bold" },
              },
            ],
          ],
          body: [
            [
              {
                content: clausula.conteudo || "",
                styles: { halign: "left", fontSize: 10 },
              },
            ],
          ],
          startY: (pdf as any).lastAutoTable?.finalY + 5 || 10,
          theme: "plain",
          styles: {
            fontSize: 10,
            cellPadding: 2,
            valign: "top",
            overflow: "linebreak",
            lineWidth: 0.1,
          },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        });
      });
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}
