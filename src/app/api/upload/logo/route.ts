import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ensureEmpresaId } from "@/lib/auth-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG ou WebP" },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Tamanho máximo: 5MB" },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${empresaId}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verificar se o cliente admin está disponível
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Fazer upload para o Supabase Storage usando admin client (bypassa RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("empresas")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Erro ao fazer upload da imagem" },
        { status: 500 }
      );
    }

    // Obter URL pública da imagem
    const { data: urlData } = supabaseAdmin.storage
      .from("empresas")
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        url: urlData.publicUrl,
        path: filePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

