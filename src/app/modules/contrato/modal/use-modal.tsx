"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Cliente } from "@/app/api/cliente/types";
import { Local as LocalAPI } from "@/app/api/local/types";
import {
  CreateContratoData,
  Contrato,
  ContratoItem,
  ContratoStatus,
  UpdateContratoData,
} from "@/app/api/contrato/types";
import { centsToDecimal } from "@/utils/currency";

import { Categoria, Item, ContratoModalProps } from "../types";

const contratoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  orcamentoId: z.number().optional(),
  status: z.enum(["RASCUNHO", "ATIVO", "CONCLUIDO", "CANCELADO"]).optional(),
  dataEvento: z.string().min(1, "Data do evento é obrigatória"),
  horaInicio: z.string().min(1, "Hora de início é obrigatória"),
  observacao: z.string().optional(),
});

export const useContratoModal = ({
  contrato,
  onSuccess,
  open,
}: Omit<ContratoModalProps, "onOpenChange">) => {
  const [activeTab, setActiveTab] = useState("dados-gerais");
  const [itens, setItens] = useState<CreateContratoData["itens"]>([]);
  const [total, setTotal] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [localSelecionado, setLocalSelecionado] = useState<LocalAPI | undefined>(undefined);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | undefined>(
    undefined
  );

  const getContrato = async () => {
    if (!contrato?.id) {
      throw new Error("ID do contrato não fornecido");
    }

    try {
      const response = await fetch(`/api/contrato/${contrato.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Erro ao buscar contrato");
      }

      return response.json() as Promise<Contrato>;
    } catch (error) {
      console.error("Erro ao buscar contrato:", error);
      throw new Error("Erro ao buscar contrato");
    }
  };

  const { data, isLoading } = useQuery<Contrato>({
    queryKey: ["getContrato", contrato?.id],
    queryFn: getContrato,
    enabled: !!contrato?.id,
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      clienteId: 0,
      categoriaId: undefined,
      status: "RASCUNHO" as ContratoStatus,
      localId: undefined,
      orcamentoId: undefined,
      dataEvento: "",
      horaInicio: "",
      observacao: "",
    },
  });

  const calculateTotal = (itensList: CreateContratoData["itens"]) => {
    const total = itensList.reduce((acc, item) => {
      return acc + (item.quantidade * item.valorUnit - (item.desconto || 0));
    }, 0);
    setTotal(total);
  };

  const addItemFromAutocomplete = (item: Item) => {
    const newItem = {
      itemId: item.id,
      nome: item.nome,
      quantidade: 1,
      valorUnit: item.precoBase,
      desconto: 0,
      valorTotal: item.precoBase,
    };
    const newItens = [...itens, newItem];
    setItens(newItens);
    calculateTotal(newItens);
  };

  const updateItem = (
    index: number,
    field: keyof CreateContratoData["itens"][0],
    value: number
  ) => {
    const newItens = [...itens];
    newItens[index] = { ...newItens[index], [field]: value };
    setItens(newItens);
    calculateTotal(newItens);
  };

  const removeItem = (index: number) => {
    const newItens = itens.filter((_, i) => i !== index);
    setItens(newItens);
    calculateTotal(newItens);
  };

  const createMutation = useMutation({
    mutationFn: async (contratoData: CreateContratoData) => {
      const response = await fetch("/api/contrato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contratoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar contrato");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Contrato criado com sucesso!");
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: contratoData }: { id: number; data: UpdateContratoData }) => {
      const response = await fetch(`/api/contrato/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contratoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar contrato");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso!");

      resetForm();

      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (contratoData: CreateContratoData) => {
    if (!contrato?.id) {
      await createMutation.mutateAsync(contratoData);
    } else if (contrato?.id) {
      // Para atualização, remover campos não esperados pela API
      const itensParaAtualizacao = contratoData.itens.map((item) => ({
        itemId: item.itemId,
        quantidade: item.quantidade,
        valorUnit: item.valorUnit,
        desconto: item.desconto || 0,
      }));

      const updateData: UpdateContratoData = {
        clienteId: contratoData.clienteId,
        categoriaId: contratoData.categoriaId,
        localId: contratoData.localId,
        orcamentoId: contratoData.orcamentoId,
        status: contratoData.status,
        dataEvento: contratoData.dataEvento,
        horaInicio: contratoData.horaInicio,
        observacao: contratoData.observacao,
        itens: itensParaAtualizacao as any,
      };

      await updateMutation.mutateAsync({
        id: contrato.id,
        data: updateData,
      });
    }
  };

  const onSubmit = (values: z.infer<typeof contratoSchema>) => {
    if (itens.length === 0) {
      toast.warning("Adicione pelo menos um item ao contrato.", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    handleSubmit({
      ...values,
      itens,
    });
  };

  const handleClienteSelect = (cliente: Cliente | null) => {
    setClienteSelecionado(cliente || undefined);
    if (cliente) {
      form.setValue("clienteId", cliente.id);
    } else {
      form.setValue("clienteId", 0);
    }
  };

  const handleLocalSelect = (local: LocalAPI | null) => {
    setLocalSelecionado(local || undefined);
    if (local) {
      form.setValue("localId", local.id);
    } else {
      form.setValue("localId", undefined);
    }
  };

  const handleCategoriaSelect = (categoria: Categoria | null) => {
    setCategoriaSelecionada(categoria || undefined);
    if (categoria) {
      form.setValue("categoriaId", categoria.id);
    } else {
      form.setValue("categoriaId", undefined);
    }
  };

  const resetForm = () => {
    form.reset({
      clienteId: 0,
      categoriaId: undefined,
      status: "RASCUNHO",
      localId: undefined,
      orcamentoId: undefined,
      dataEvento: "",
      horaInicio: "",
      observacao: "",
    });
    setItens([]);
    setTotal(0);
    setClienteSelecionado(undefined);
    setLocalSelecionado(undefined);
    setCategoriaSelecionada(undefined);
    setActiveTab("dados-gerais");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
      setActiveTab("dados-gerais");
    } else if (open && !contrato?.id) {
      // Se a modal abrir sem contrato, garantir que o formulário está limpo
      resetForm();
    }
  }, [open, contrato?.id]);

  useEffect(() => {
    if (data && contrato?.id) {
      form.reset({
        clienteId: data.clienteId || 0,
        categoriaId: data.categoriaId || undefined,
        status: (data.status as ContratoStatus) || "RASCUNHO",
        localId: data.localId || undefined,
        orcamentoId: data.orcamentoId || undefined,
        dataEvento: data.dataEvento ? new Date(data.dataEvento).toISOString().split("T")[0] : "",
        horaInicio: data.horaInicio ? new Date(data.horaInicio).toTimeString().slice(0, 5) : "",
        observacao: data.observacao || "",
      });

      if (data.cliente) {
        setClienteSelecionado({
          id: data.cliente.id,
          nome: data.cliente.nome,
          telefone: data.cliente.telefone,
          email: data.cliente.email,
        });
      }

      if (data.local) {
        setLocalSelecionado({
          id: data.local.id,
          descricao: data.local.descricao,
        });
      }

      if (data.categoriaFesta) {
        setCategoriaSelecionada({
          id: data.categoriaFesta.id,
          descricao: data.categoriaFesta.descricao,
        });
      }

      if (data.itens && data.itens.length > 0) {
        const itensFormatados: CreateContratoData["itens"] = data.itens.map((item) => ({
          itemId: item.itemId,
          nome: item.item?.nome || "",
          quantidade: item.quantidade,
          valorUnit: item.valorUnit,
          desconto: item.desconto || 0,
          valorTotal: item.valorTotal || 0,
        }));
        setItens(itensFormatados);
        calculateTotal(itensFormatados);
      }
    }
  }, [data, contrato?.id]);

  return {
    activeTab,
    setActiveTab,
    itens,
    total,
    form,
    clienteSelecionado,
    localSelecionado,
    categoriaSelecionada,

    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isLoading,

    addItemFromAutocomplete,
    updateItem,
    removeItem,
    onSubmit,
    handleClienteSelect,
    handleLocalSelect,
    handleCategoriaSelect,
  };
};
