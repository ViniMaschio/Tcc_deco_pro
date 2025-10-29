"use client";

import { Loader2, Building2, FileText, Palette } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";
import { TemaTab } from "./tabs/tema";
import { EmpresaTab } from "./tabs/empresa";
import { ContratoTab } from "./tabs/contrato";
import { twMerge } from "tailwind-merge";
import { MountTabs } from "./tabs";
import { ConfiguracoesTabs } from "./types";

interface ConfiguracoesModalProps {
  open: boolean;
  changeOpen: (open: boolean) => void;
}

export const ConfiguracoesModal = ({ open, changeOpen }: ConfiguracoesModalProps) => {
  const {
    configuracoes,
    showState,
    activeTab,
    setActiveTab,
    handleChangeConfiguracao,
    handleSaveConfiguracoes,
  } = useConfiguracoes();

  const handleCloseModal = () => {
    changeOpen(false);
  };

  const { tabs } = MountTabs();

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent
        className={twMerge(
          "grid max-h-[90dvh] max-w-[80dvw] overflow-auto transition-all duration-500 ease-in-out",
          activeTab === "tema" ? "md:max-w-[50dvw] lg:max-w-[40dvw]" : "sm:max-w-[80dvw]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Configurações do Sistema</DialogTitle>
          <DialogDescription>Gerencie suas configurações pessoais e da empresa</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="flex h-full w-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-3">
            {tabs.trigger.map((tab) => (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className="flex items-center gap-2"
                onClick={() => setActiveTab(tab.name as ConfiguracoesTabs)}
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 overflow-y-auto">
            {tabs.content.map((content) => (
              <TabsContent
                key={content.name}
                value={content.name}
                className={twMerge("space-y-4", activeTab !== content.name && "hidden")}
              >
                {content.render}
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCloseModal} disabled={showState.saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveConfiguracoes}
            disabled={showState.saving}
            className="min-w-[100px]"
          >
            {showState.saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
