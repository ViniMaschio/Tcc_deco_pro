"use client";

import { Building2, FileText, Palette } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";
import { twMerge } from "tailwind-merge";
import { MountTabs } from "./tabs";
import { ConfiguracoesTabs, ConfiguracoesModalProps } from "./types";

export const ConfiguracoesModal = ({ open, changeOpen }: ConfiguracoesModalProps) => {
  const { configuracoes, activeTab, setActiveTab, handleChangeConfiguracao } =
    useConfiguracoes(open);

  const handleCloseModal = () => {
    changeOpen(false);
  };

  const { tabs } = MountTabs({ onClose: handleCloseModal });

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
      </DialogContent>
    </Dialog>
  );
};
