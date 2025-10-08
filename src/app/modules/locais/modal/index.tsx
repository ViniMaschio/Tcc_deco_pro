import { XIcon } from "@phosphor-icons/react";

import { InputWithSearch } from "@/components/input-search";
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
import { Separator } from "@/components/ui/separator";

import { LocalModalProps } from "./types";
import { useLocalModal } from "./use-modal";

export const LocalModal = ({
  open,
  changeOpen,
  local,
  afterSubmit,
}: LocalModalProps) => {
  const { form, onSubmit, searchZipCode, localModalStates } = useLocalModal({
    afterSubmit,
    local,
  });

  return (
    <Dialog open={open} onOpenChange={(value) => changeOpen(value)}>
      <DialogContent className="flex max-h-[90vh] max-w-[90vw] flex-col justify-between sm:max-w-[75vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {local?.id ? "Edição" : "Cadastro"} de Locais{" "}
          </DialogTitle>
          <button
            onClick={() => changeOpen(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <XIcon size={25} />
          </button>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="overflow-auto"
          >
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-10 w-full">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descrição"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 w-full">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 w-full">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-3">
                      <FormLabel className="text-our-text-gray font-bold">
                        CEP
                      </FormLabel>
                      <FormControl>
                        <InputWithSearch
                          onSearch={(value) =>
                            searchZipCode(value?.toString() || "")
                          }
                          searching={localModalStates.zipCode}
                          placeholder="CEP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 w-full">
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 w-full">
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="rua"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Numero</FormLabel>
                      <FormControl>
                        <Input placeholder="Numero" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3 w-full">
                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem className="col-span-1'">
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Complemento" {...field} />
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
              form.reset({
                descricao: "",
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: "",
                telefone: "",
              });
              changeOpen(false);
            }}
            disabled={localModalStates.submitting}
          >
            Cancelar
          </Button>
          <Button
            variant={"default"}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
            loading={localModalStates.submitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
