import { XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { ItemModalProps } from "./types";
import { useItemModal } from "./use-modal";

export const ItemModal = ({ open, changeOpen, item, afterSubmit }: ItemModalProps) => {
  const { form, onSubmit, itemModalState, handleResetForm } = useItemModal({
    afterSubmit,
    item,
  });

  return (
    <Dialog open={open} onOpenChange={(value) => changeOpen(value)}>
      <DialogContent className="flex max-w-[60vw] flex-col justify-between md:max-w-[40vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{item?.id ? "Edição" : "Cadastro"} de Itens </DialogTitle>
          <button
            onClick={() => changeOpen(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <XIcon size={25} />
          </button>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-auto">
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="col-span-3'">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="col-span-3'">
                      <FormLabel>Descrição (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem className="col-span-3'">
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PRO">Produto</SelectItem>
                          <SelectItem value="SER">Serviço</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="precoBase"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Preço Base</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="grid grid-cols-2 gap-2 py-2 sm:flex">
          <Button
            variant={"outline"}
            onClick={() => {
              handleResetForm();
              changeOpen(false);
            }}
            disabled={itemModalState.submitting}
          >
            Cancelar
          </Button>
          <Button
            variant={"default"}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
            loading={itemModalState.submitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
