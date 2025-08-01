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
import { useState } from "react";
import { toast } from 'sonner'
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { LoginUser } from '@/core/domain/use-cases/LoginUser'
import { useAuth } from "@/ui/context/AuthContext";
import { Version } from "@/ui/components/Version";
import { getMessage } from "@/core/domain/messages";
import { useView } from "@/ui/context/ViewContext";

const formSchema = z.object({
  username: z.string().min(2, getMessage("errors", "zod_username_required")),
  password: z.string().min(4, getMessage("errors", "zod_password_required"))
})



export default function Login() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRememberMeChange, rememberMe, login, validationToken } = useAuth();
  const [showIndio, setShowIndio] = useState(true)
  const { setView } = useView();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        password: "",
      }, 
    })
  
    const handleChangeView = (view: string) => {
      setShowIndio(false)

      setTimeout(() => {
        setView(view) 
      }, 500)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (isSubmitting) return; // Previene múltiples envíos
      setIsSubmitting(true); // Establece el estado de envío a verdadero
      const loginUseCase = new LoginUser(new AuthApiService());

      try {
        await toast.promise(
          loginUseCase.execute(values.username, values.password)  
          .then((response) => {

              if (response.message === "ACTIVATE_MFA") {
                login(response.data.user! , response.data.accessToken!);
                validationToken(response.data.tempToken as string);
                setView("ActivateMfa");
                setIsSubmitting(false);
                return;
              }

              if (response.message === "MFA_INHABILITATE") {
                login(response.data.user! , response.data.accessToken!);
                handleChangeView("dashboard");
                setIsSubmitting(false);
                return;
              }

              if (response.message === "VALIDATE_MFA") {
                validationToken(response.data.tempToken as string);
                setView("validateMfa");
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
      
      <div id="container" className="h-dvh">
        <div  className={`indio transition-opacity duration-500 animate-in fade-in slide-in-from-top-8 duration-900 ${
          showIndio ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          ></div>
        <div id="top-image"></div>
        <div className=" flex h-9/10 w-screen items-center justify-center">
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
                            <Input placeholder="Tu usuario" {...field} />
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
                      <a onClick={() => handleChangeView("resetPassword")} className="text-sm font-medium hover:cursor-pointer">
                        {getMessage("ui", "login_forgot_password")}
                      </a>
                      
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
        </div>
        <div className="text-center text-xs">
          <div><p>© 2025 Gesinova. Todos los derechos reservados.</p></div>
          <div><a href="https://www.login.gov/es/policy/">Prácticas de seguridad y declaración de privacidad</a></div>
          <div><a href="https://www.login.gov/es/policy/our-privacy-act-statement/">Declaración de privacidad</a></div>
        </div>
      </div>
    );
  }