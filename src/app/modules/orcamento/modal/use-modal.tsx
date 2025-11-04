"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Cliente } from "@/app/api/cliente/types";
import { Local as LocalAPI } from "@/app/api/local/types";
import {
  CreateOrcamentoData,
  Orcamento,
  OrcamentoStatus,
  UpdateOrcamentoData,
} from "@/app/api/orcamento/types";

import { Categoria, Item, UseOrcamentoModalProps } from "../types";

const orcamentoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  status: z
    .enum(["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "VENCIDO", "CANCELADO"])
    .optional(),
  dataEvento: z.string().optional(),
  observacao: z.string().optional(),
});

export const useOrcamentoModal = ({ mode, data, onSuccess }: UseOrcamentoModalProps) => {
  const [activeTab, setActiveTab] = useState("dados-gerais");
  const [itens, setItens] = useState<CreateOrcamentoData["itens"]>([]);
  const [total, setTotal] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [localSelecionado, setLocalSelecionado] = useState<LocalAPI | undefined>(undefined);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | undefined>(
    undefined
  );

  const getOrcamento = async () => {
    if (!data?.id) {
      throw new Error("ID do orçamento é obrigatório");
    }

    const response = await fetch(`/api/orcamento/${data.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar orçamento");
    }

    return response.json() as Promise<Orcamento>;
  };

  const { data: orcamentoData, isLoading: isLoadingOrcamento } = useQuery<Orcamento>({
    queryKey: ["orcamento", data?.id],
    queryFn: () => getOrcamento(),
    enabled: mode === "edit" && !!data?.id,
  });

  const form = useForm<z.infer<typeof orcamentoSchema>>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      clienteId: data?.clienteId || 0,
      categoriaId: data?.categoriaId || undefined,
      status: (data?.status as OrcamentoStatus) || "RASCUNHO",
      localId: data?.localId || undefined,
      dataEvento: data?.dataEvento ? new Date(data.dataEvento).toISOString().split("T")[0] : "",
      observacao: data?.observacao || "",
    },
  });

  // Efeito para resetar o formulário quando os dados mudam
  useEffect(() => {
    // Usar dados carregados da API quando disponível, senão usar dados passados como prop
    const currentData = orcamentoData || data;

    if (currentData && mode !== "create") {
      form.reset({
        clienteId: currentData.clienteId,
        categoriaId: currentData.categoriaId || undefined,
        status: (currentData.status as OrcamentoStatus) || "RASCUNHO",
        localId: currentData.localId || undefined,
        dataEvento: currentData.dataEvento
          ? new Date(currentData.dataEvento).toISOString().split("T")[0]
          : "",
        observacao: currentData.observacao || "",
      });

      // Carregar dados relacionados para os autocompletes
      if (currentData.cliente) {
        setClienteSelecionado({
          id: currentData.cliente.id,
          nome: currentData.cliente.nome,
          telefone: currentData.cliente.telefone,
          email: currentData.cliente.email,
        });
      }

      if (currentData.local) {
        setLocalSelecionado({
          id: currentData.local.id,
          descricao: currentData.local.descricao,
        });
      }

      if (currentData.categoriaFesta) {
        setCategoriaSelecionada({
          id: currentData.categoriaFesta.id,
          descricao: currentData.categoriaFesta.descricao,
        });
      }

      if (currentData.itens && currentData.itens.length > 0) {
        // Limpar itens antes de adicionar novos
        setItens([]);

        // Buscar cada item completo e adicionar usando addItemFromAutocomplete
        const loadItems = async () => {
          for (const orcamentoItem of currentData.itens || []) {
            try {
              // Buscar item completo da API
              const itemResponse = await fetch(`/api/item/${orcamentoItem.itemId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              });

              if (itemResponse.ok) {
                const itemData = await itemResponse.json();

                // Criar objeto Item compatível com addItemFromAutocomplete
                const item: Item = {
                  id: itemData.id,
                  nome: itemData.nome,
                  descricao: itemData.descricao,
                  precoBase: itemData.precoBase,
                  tipo: itemData.tipo,
                };

                // Usar addItemFromAutocomplete para adicionar o item
                // Primeiro obter o estado atual dos itens
                let currentItensState: CreateOrcamentoData["itens"] = [];
                await new Promise<void>((resolve) => {
                  setItens((prevItens) => {
                    currentItensState = [...prevItens];
                    resolve();
                    return prevItens;
                  });
                });

                // Criar objeto Item e usar addItemFromAutocomplete
                // A função adiciona com quantidade 1, valorUnit = precoBase, desconto 0
                addItemFromAutocomplete(item);

                // Aguardar um tick para garantir que o estado foi atualizado
                await new Promise((resolve) => setTimeout(resolve, 0));

                // Atualizar quantidade, valorUnit e desconto do último item adicionado
                setItens((prevItens) => {
                  if (prevItens.length === 0) return prevItens;

                  const newItens = [...prevItens];
                  const lastIndex = newItens.length - 1;
                  newItens[lastIndex] = {
                    ...newItens[lastIndex],
                    quantidade: orcamentoItem.quantidade,
                    valorUnit: orcamentoItem.valorUnit,
                    desconto: orcamentoItem.desconto || 0,
                  };

                  calculateTotal(newItens);
                  return newItens;
                });
              } else {
                // Se não conseguir buscar o item completo, criar item com dados do orçamento
                setItens((prevItens) => {
                  const fallbackItem = {
                    itemId: orcamentoItem.itemId,
                    nome: orcamentoItem.nome,
                    quantidade: orcamentoItem.quantidade,
                    valorUnit: orcamentoItem.valorUnit,
                    desconto: orcamentoItem.desconto || 0,
                  };
                  const newItens = [...prevItens, fallbackItem];
                  calculateTotal(newItens);
                  return newItens;
                });
              }
            } catch (error) {
              console.error(`Erro ao buscar item ${orcamentoItem.itemId}:`, error);
              // Em caso de erro, criar item com dados do orçamento
              setItens((prevItens) => {
                const fallbackItem = {
                  itemId: orcamentoItem.itemId,
                  nome: orcamentoItem.nome,
                  quantidade: orcamentoItem.quantidade,
                  valorUnit: orcamentoItem.valorUnit,
                  desconto: orcamentoItem.desconto || 0,
                };
                const newItens = [...prevItens, fallbackItem];
                calculateTotal(newItens);
                return newItens;
              });
            }
          }
        };

        loadItems();
      }
    } else {
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
    }
  }, [data, orcamentoData, mode, form]);

  // Funções para gerenciar itens
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

  return {
    // Estados
    activeTab,
    setActiveTab,
    itens,
    total,
    form,
    clienteSelecionado,
    localSelecionado,
    categoriaSelecionada,

    // Estados de loading
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isLoadingOrcamento,

    // Funções
    addItemFromAutocomplete,
    updateItem,
    removeItem,
    onSubmit,
    handleClienteSelect,
    handleLocalSelect,
    handleCategoriaSelect,
  };
};
