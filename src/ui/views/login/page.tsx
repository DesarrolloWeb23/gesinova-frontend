import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { Input } from "@/ui/components/ui/input"
import { Checkbox } from "@/ui/components/ui/checkbox"
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
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(2).max(50),
})



export default function Login({ onLogin, onRemember }: { onLogin: (x) => void, onRemember: () => void }) {

  useEffect(() => {
    const movementStrength = 25;
    const height = movementStrength / window.innerHeight;
    const width = movementStrength / window.innerWidth;

    const handleMouseMove = (e) => {
      const pageX = e.pageX - window.innerWidth / 2;
      const pageY = e.pageY - window.innerHeight / 2;
      const newvalueX = width * pageX * -1 - 25;
      const newvalueY = height * pageY * -1 - 50;

      const topImage = document.getElementById("top-image");
      if (topImage) {
        topImage.style.backgroundPosition = `${newvalueX}px ${newvalueY}px`;
      }
    };

    const topImage = document.getElementById("container");
    if (topImage) {
      topImage.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (topImage) {
        topImage.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

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

      // fetch("http://localhost:8080/auth/nosecured")
      // .then((response) => {
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! Status: ${response.status}`);
      //   }
      //   const contentType = response.headers.get("content-type");
      //   if (!contentType || !contentType.includes("application/json")) {
      //     throw new Error("La respuesta no es JSON");
      //   }
      //   return response.json();
      // })
      // .then((data) => {
      //   console.log("Datos obtenidos:", data);
      // })
      // .catch((error) => {
      //   console.error("Error al obtener datos:", error);
      // });
      

      fetch("http://localhost:8080/auth/nosecured")
      .then((response) => response.text())
      .then((data) => {
        console.log("Texto recibido:", data);
        //enviar el texto a la vista de dashboard
        onLogin(data);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });


    }
    
    return (
      
      <div id="container" className="flex h-screen w-screen items-center justify-center">
        <div id="top-image"></div>
        <Card className="absolute w-[350px]">
            <CardHeader  className="items-center justify-center">
                <CardTitle className="font-bold text-2xl">Bienvenidos a Gesinova</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="items-top flex space-x-2">
                        
                        <Checkbox id="remember" />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Recordarme
                          </label>
                        </div>
                      </div>
                      <a onClick={onRemember}  className="text-sm font-medium text-blue-600 hover:underline">Olvidaste tu contraseña?</a>
                      
                    </div>

                    <div className="flex items-center justify-between">
                      <Button type="submit"  className="w-full">Ingresar</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground"> version 1.0.0</p>
              </CardFooter>
        </Card>
        <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center text-sm">
          <p>© 2025 Gesinova. Todos los derechos reservados.</p>
        </div>
      </div>
    );
  }