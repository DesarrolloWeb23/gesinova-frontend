import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { ValidateMfa } from '@/core/domain/use-cases/ValidateMfa'
import { toast } from 'sonner'
import { Input } from "@/ui/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ui/components/ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useAuth } from "@/ui/context/AuthContext";
import { Version } from "@/ui/components/Version";
import { getMessage } from "@/core/domain/messages";

const formSchema = z.object({
  code: z.string().min(6, "El codigo es requerido"),
})

export default function RequiredMfa( {setView }: { setView: (view: string) => void; }) {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tempToken, login } = useAuth();
  
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validateMfaUseCase = new ValidateMfa(new AuthApiService());

    try {
      await toast.promise(
        validateMfaUseCase.execute(tempToken, values.code)
          .then((response) => {
            login(response.data, response.data.accessToken);
            setIsSubmitting(false);
            setView("dashboard");
          })
          .catch((error) => {
            setIsSubmitting(false);
            setView("login");
            throw error;
          }),
        {
          loading:  getMessage("success", "access_loading"),
          success: getMessage("success", "mfa_validation_success"),
          error: (error) =>
            error?.data?.message
              ? "Error: " + error?.data?.message
              : getMessage("errors", "handle_error") + error.message,
        }
      );
    } catch (error) {
      console.error("Error al validar el doble factor:", error);
    } finally {
      setIsSubmitting(false);
    }
    
  }

  return (
    
    <div id="container" className="flex h-screen w-screen items-center justify-center">
      <div id="top-image"></div>
      <Card className="absolute w-[350px]">
          <CardHeader  className="items-center justify-center">
              <Button onClick={() => setView("login")} className="bg-blue-500 text-white px-4 py-2 rounded">Volver</Button>
              <CardTitle className="font-bold text-2xl">Validacion de doble factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ingresa el codigo de verificacion que se ha enviado.</p>
              <div className="flex flex-col gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Codigo de verificacion" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting === true ? "Validando..." : "Validar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Version></Version>
              </CardFooter>
        </Card>
      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center text-sm">
        <p>© 2025 Gesinova. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}