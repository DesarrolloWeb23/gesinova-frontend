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
import { useEffect, useState } from "react";
import { toast } from 'sonner'
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { LoginUser } from '@/core/domain/use-cases/LoginUser'
import { useAuth } from "@/ui/context/AuthContext";
import { Version } from "@/ui/components/Version";
import { getMessage } from "@/core/domain/messages";

const formSchema = z.object({
  username: z.string().min(2, getMessage("errors", "zod_username_required")),
  password: z.string().min(4, getMessage("errors", "zod_password_required"))
})



export default function Login({ setView }: {  setView: (view: string) => void; }) {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRememberMeChange, rememberMe, login, validationToken } = useAuth();
  
  useEffect(() => {
    const movementStrength = 25;
    const height = movementStrength / window.innerHeight;
    const width = movementStrength / window.innerWidth;

    const handleMouseMove = (e: MouseEvent) => {
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

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        password: "",
      }, 
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (isSubmitting) return; // Previene múltiples envíos
      setIsSubmitting(true); // Establece el estado de envío a verdadero
      const loginUseCase = new LoginUser(new AuthApiService());

      try {
        await toast.promise(
          loginUseCase.execute(values.username, values.password)  
          .then((response) => {

              if (response.status === "ACTIVATE_MFA") {
                login(response.data , response.data.accessToken);
                setView("ActivateMfa");
                setIsSubmitting(false);
                return;
              }

              if (response.status === "MFA_INHABILITATED") {
                login(response.data , response.data.accessToken);
                setView("dashboard");
                setIsSubmitting(false);
                return;
              }

              if (response.status === "MFA_REQUIRED") {
                validationToken(response.data.tempToken);
                setView("requiredMfa");
                setIsSubmitting(false);
                return;
              }
            })
            .catch((error) => {
              setIsSubmitting(false);
              throw error;
            }),
          {
            loading: getMessage("success", "access_loading"),
            success: getMessage("success", "access_success") + values.username,
            error: (error) => 
              error?.message
          }
        );
      } catch (error) {
        setIsSubmitting(false);
        console.error("Error al iniciar sesión:", error);
      }
    }
    
    return (
      
      <div id="container" className="flex h-screen w-screen items-center justify-center">
        <div id="top-image"></div>
        <Card className="absolute w-[350px]">
            <CardHeader  className="items-center justify-center">
                <CardTitle className="font-bold text-2xl">{getMessage("ui", "login_welcome")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getMessage("ui", "login_username")}</FormLabel>
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
                          <FormLabel>{getMessage("ui", "login_password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="items-top flex space-x-2">
                        
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={handleRememberMeChange} 
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {getMessage("ui", "login_remember_me")}
                          </label>
                        </div>
                      </div>
                      <a className="text-sm font-medium hover:underline">{getMessage("ui", "login_forgot_password")}</a>
                      
                    </div>

                    <div className="flex items-center justify-between">
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting === true ? getMessage("ui", "login_submiting") : getMessage("ui", "login_submit")}
                      </Button>
                    </div>
                  </form>
                </Form>
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