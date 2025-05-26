import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { Input } from "@/ui/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

export default function Login({  comeBack }: {  comeBack: () => void  }) {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
      },
    })
    
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }
    
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Card className="w-[550px]">
            <CardHeader>
                <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription>Por favor, informe su correo electronico para que una invitacion de nueva contraseña sea enviada. </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electronico</FormLabel>
                          <FormControl>
                            <Input placeholder="ejemplo@dominio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="items-top flex space-x-2">
                        <div className="grid gap-1.5 leading-none">
                          <a onClick={comeBack} className="text-sm font-medium text-blue-600 hover:underline">Volver al inicio de sesion</a>
                        </div>
                      </div>
                      <Button type="submit">Recuperar</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
              </CardFooter>
        </Card>
        <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center bg-background text-sm text-muted-foreground">
          <p>© 2025 Gesinova. Todos los derechos reservados.</p>
        </div>
      </div>
    );
  }