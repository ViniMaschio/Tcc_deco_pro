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
  CreateOrcamentoData,
  Orcamento,
  OrcamentoItem,
  OrcamentoStatus,
  UpdateOrcamentoData,
} from "@/app/api/orcamento/types";

import { Categoria, Item, OrcamentoModalProps } from "../types";

const orcamentoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  status: z.enum(["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "CANCELADO"]).optional(),
  dataEvento: z.string().optional(),
  observacao: z.string().optional(),
});

export const useOrcamentoModal = ({
  orcamento,
  onSuccess,
  open,
}: Omit<OrcamentoModalProps, "onOpenChange">) => {
  const [activeTab, setActiveTab] = useState("dados-gerais");
  const [itens, setItens] = useState<CreateOrcamentoData["itens"]>([]);
  const [total, setTotal] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [localSelecionado, setLocalSelecionado] = useState<LocalAPI | undefined>(undefined);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | undefined>(
    undefined
  );

  const getOrcamento = async () => {
    if (!orcamento?.id) {
      throw new Error("ID do orçamento não fornecido");
    }

    try {
      const response = await fetch(`/api/orcamento/${orcamento.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Erro ao buscar orçamento");
      }

      return response.json() as Promise<Orcamento>;
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      throw new Error("Erro ao buscar orçamento");
    }
  };

  const { data, isLoading } = useQuery<Orcamento>({
    queryKey: ["getOrcamento", orcamento?.id],
    queryFn: getOrcamento,
    enabled: !!orcamento?.id,
  });

  const form = useForm<z.infer<typeof orcamentoSchema>>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      clienteId: 0,
      categoriaId: undefined,
      status: "RASCUNHO" as OrcamentoStatus,
      localId: undefined,
      dataEvento: "",
      observacao: "",
    },
  });

  const calculateTotal = (itensList: CreateOrcamentoData["itens"]) => {
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
    field: keyof CreateOrcamentoData["itens"][0],
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
    mutationFn: async (orcamentoData: CreateOrcamentoData) => {
      const response = await fetch("/api/orcamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orcamentoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar orçamento");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Orçamento criado com sucesso!");
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: orcamentoData }: { id: number; data: UpdateOrcamentoData }) => {
      const response = await fetch(`/api/orcamento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orcamentoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar orçamento");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Orçamento atualizado com sucesso!");

      resetForm();

      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (orcamentoData: CreateOrcamentoData) => {
    if (!orcamento?.id) {
      await createMutation.mutateAsync(orcamentoData);
    } else if (orcamento?.id) {
      const itensParaAtualizacao = orcamentoData.itens.map((item) => ({
        itemId: item.itemId,
        quantidade: item.quantidade,
        valorUnit: item.valorUnit,
        desconto: item.desconto || 0,
      }));

      await updateMutation.mutateAsync({
        id: orcamento.id,
        data: {
          ...orcamentoData,
          itens: itensParaAtualizacao,
        },
      });
    }
  };

  const onSubmit = (values: z.infer<typeof orcamentoSchema>) => {
    if (itens.length === 0) {
      toast.warning("Adicione pelo menos um item ao orçamento.", {
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
      dataEvento: "",
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
    } else if (open && !orcamento?.id) {
      resetForm();
    }
  }, [open, orcamento?.id]);

  useEffect(() => {
    if (data && orcamento?.id) {
      form.reset({
        clienteId: data.clienteId || 0,
        categoriaId: data.categoriaId || undefined,
        status: (data.status as OrcamentoStatus) || "RASCUNHO",
        localId: data.localId || undefined,
        dataEvento: data.dataEvento ? new Date(data.dataEvento).toISOString().split("T")[0] : "",
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
        const itensFormatados: CreateOrcamentoData["itens"] = data.itens.map((item) => ({
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
  }, [data, orcamento?.id]);

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
