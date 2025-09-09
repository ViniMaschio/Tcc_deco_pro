"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useFormLogin } from "./use-login-form";

export const FormLogin = () => {
  const { form, onSubmit } = useFormLogin();

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Insira o seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira minha senha"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Entrar
          </Button>
          <div className="flex justify-center gap-2">
            <p className="max-w-[360px] text-center text-gray-600">
              Já possui uma conta?
            </p>
            <Link
              href="/cadastro"
              className="font-semibold text-gray-800 hover:underline"
            >
              Cadastrar-se
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
