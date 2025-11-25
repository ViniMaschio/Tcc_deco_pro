"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { IconButton } from "@/components/icon-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadLogoProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
  disabled?: boolean;
}

export const UploadLogo = ({ value, onChange, onUpload, className, disabled }: UploadLogoProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando value mudar (mas não durante upload)
  useEffect(() => {
    if (!uploading) {
      setPreview(value || null);
    }
  }, [value, uploading]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP");
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5MB");
      return;
    }

    // Criar preview local
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Fazer upload se houver função onUpload
    if (onUpload) {
      setUploading(true);
      try {
        const url = await onUpload(file);
        onChange(url);
        // Limpar preview local e usar a URL do servidor
        URL.revokeObjectURL(previewUrl);
        setPreview(url);
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao fazer upload da imagem";
        toast.error(errorMessage);
        setPreview(value || null);
      } finally {
        setUploading(false);
      }
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
          disabled && "cursor-not-allowed opacity-50",
          className || "w-full"
        )}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Logo da empresa" fill className="object-contain p-2" />
            {!disabled && (
              <IconButton
                icon={<X className="h-4 w-4" />}
                variant="deleteDefault"
                size="icon"
                tooltip="Remover logo"
                className="absolute right-2 bottom-2 z-10 h-8 w-8 rounded-full border-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={uploading}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div className="text-sm text-gray-500">
              {uploading ? "Enviando..." : "Clique para fazer upload"}
            </div>
            <div className="text-xs text-gray-400">PNG, JPG, WebP até 5MB</div>
          </div>
        )}

        {!disabled && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileSelect}
            disabled={uploading || disabled}
          />
        )}
      </div>
    </div>
  );
};
