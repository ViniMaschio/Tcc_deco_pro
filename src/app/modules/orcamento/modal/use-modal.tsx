"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Cliente } from "@/app/api/cliente/types";
import { Local as LocalAPI } from "@/app/api/local/types";
import { CreateOrcamentoData } from "@/app/api/orcamento/types";

import { Categoria, Item, Local, UseOrcamentoModalProps } from "../types";

const orcamentoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  dataEvento: z.string().optional(),
  observacao: z.string().optional(),
});

export const useOrcamentoModal = ({ mode, data, onSuccess }: UseOrcamentoModalProps) => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [itensDisponiveis, setItensDisponiveis] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState("dados-gerais");
  const [itens, setItens] = useState<CreateOrcamentoData["itens"]>([]);
  const [total, setTotal] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [localSelecionado, setLocalSelecionado] = useState<LocalAPI | undefined>(undefined);

  const form = useForm<z.infer<typeof orcamentoSchema>>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      clienteId: data?.clienteId || 0,
      categoriaId: data?.categoriaId || undefined,
      localId: data?.localId || undefined,
      dataEvento: data?.dataEvento ? new Date(data.dataEvento).toISOString().split("T")[0] : "",
      observacao: data?.observacao || "",
    },
  });

  // Buscar dados necessários
  const { isLoading } = useQuery({
    queryKey: ["orcamento-modal-data"],
    queryFn: async () => {
      const [locaisRes, itensRes] = await Promise.all([fetch("/api/local"), fetch("/api/item")]);

      const [locaisData, itensData] = await Promise.all([locaisRes.json(), itensRes.json()]);

      setLocais(locaisData.data || []);
      setItensDisponiveis(itensData.data || []);

      // Buscar categorias se existirem
      try {
        const categoriasRes = await fetch("/api/categoria");
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.data || []);
      } catch {
        console.log("Categorias não disponíveis");
      }

      return { locaisData, itensData };
    },
  });

  // Efeito para resetar o formulário quando os dados mudam
  useEffect(() => {
    if (data && mode !== "create") {
      form.reset({
        clienteId: data.clienteId,
        categoriaId: data.categoriaId || undefined,
        localId: data.localId || undefined,
        dataEvento: data.dataEvento ? new Date(data.dataEvento).toISOString().split("T")[0] : "",
        observacao: data.observacao || "",
      });

      if (data.itens) {
        const itensData = data.itens.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
          valorUnit: item.valorUnit,
          desconto: item.desconto,
        }));
        setItens(itensData);
        calculateTotal(itensData);
      }
    } else {
      form.reset({
        clienteId: 0,
        categoriaId: undefined,
        localId: undefined,
        dataEvento: "",
        observacao: "",
      });
      setItens([]);
      setTotal(0);
    }
  }, [data, mode, form]);

  // Funções para gerenciar itens
  const calculateTotal = (itensList: CreateOrcamentoData["itens"]) => {
    const total = itensList.reduce((acc, item) => {
      return acc + (item.quantidade * item.valorUnit - (item.desconto || 0));
    }, 0);
    setTotal(total);
  };

  const addItem = () => {
    const newItem = {
      itemId: 0,
      quantidade: 1,
      valorUnit: 0,
      desconto: 0,
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

  // Mutação para criar orçamento
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
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mutação para atualizar orçamento
  const updateMutation = useMutation({
    mutationFn: async ({ id, data: orcamentoData }: { id: number; data: CreateOrcamentoData }) => {
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
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mutação para excluir orçamento
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/orcamento/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir orçamento");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Orçamento excluído com sucesso!");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (orcamentoData: CreateOrcamentoData) => {
    if (mode === "create") {
      await createMutation.mutateAsync(orcamentoData);
    } else if (mode === "edit" && data) {
      await updateMutation.mutateAsync({ id: data.id, data: orcamentoData });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const onSubmit = (values: z.infer<typeof orcamentoSchema>) => {
    if (itens.length === 0) {
      alert("Adicione pelo menos um item ao orçamento");
      return;
    }

    handleSubmit({
      ...values,
      itens,
    });
  };

  const handleDeleteClick = () => {
    if (data && window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      handleDelete(data.id);
    }
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

  return {
    // Estados
    activeTab,
    setActiveTab,
    itens,
    total,
    form,
    clienteSelecionado,
    localSelecionado,

    // Dados
    locais,
    categorias,
    itensDisponiveis,

    // Estados de loading
    isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,

    // Funções
    addItem,
    updateItem,
    removeItem,
    onSubmit,
    handleDeleteClick,
    calculateTotal,
    handleClienteSelect,
    handleLocalSelect,
  };
};
