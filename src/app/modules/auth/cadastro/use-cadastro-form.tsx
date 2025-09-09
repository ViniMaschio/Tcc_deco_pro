import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { validarCNPJ } from "@/utils/functions/validations/functions";

export const useFormCadastro = () => {
  const router = useRouter();

  const FormSchema = z
    .object({
      email: z.string().min(1, "Campo Obrigatório").email("Email inválido"),
      cnpj: z
        .string()
        .min(1, "Campo Obrigatório")
        .refine((val) => validarCNPJ(val), {
          message: "CNPJ inválido",
        }),
      senha: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número")
        .regex(
          /[^A-Za-z0-9]/,
          "A senha deve conter pelo menos um caractere especial",
        ),
      confirmarSenha: z.string().min(1, "Campo Obrigatório"),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      cnpj: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log("values", values);
    const response = await fetch("api/empresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        cnpj: values.cnpj,
        senha: values.senha,
      }),
    });

    if (response.ok) {
      router.push("/login");
      toast.success("Empresa criada com sucesso");
    } else {
      console.error("Registration Failed!");
    }
  };

  return { form, onSubmit };
};
