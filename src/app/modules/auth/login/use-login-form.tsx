import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const useFormLogin = () => {
  const router = useRouter();

  const FormSchema = z.object({
    email: z.string().min(1, "Campo Obrigatório").email("Email inválido"),

    senha: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial",
      ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      senha: values.senha,
      redirect: false,
    });

    console.log(signInData);

    if (signInData?.error) {
      toast.error("Oops! Algo deu errado! ", {
        position: "top-center",
      });
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return { form, onSubmit };
};
