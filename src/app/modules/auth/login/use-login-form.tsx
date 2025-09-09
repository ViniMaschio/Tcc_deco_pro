import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log("values", values);

    // router.push("/dashboard");

    toast.success("You submitted the following values");
  };

  return { form, onSubmit };
};
