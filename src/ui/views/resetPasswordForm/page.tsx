import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { ResetPassword } from '@/core/domain/use-cases/ResetPassword'
import { toast } from 'sonner'
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
import { getMessage } from "@/core/domain/messages";
import { Input } from "@/ui/components/ui/input";
import { TbArrowBackUp } from "react-icons/tb";
import { MdOutgoingMail } from "react-icons/md";
import { useView } from "@/ui/context/ViewContext";
import { Footer } from "@/ui/components/Footer";

const formSchema = z.object({
    email: z.string({required_error: getMessage("errors", "zod_mail_required"),}).email(getMessage("errors", "zod_mail_required"))
})

export default function ResetPasswordForm() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setView } = useView();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const resetPasswordUseCase = new ResetPassword(new AuthApiService());

    try {
      await toast.promise(
        resetPasswordUseCase.execute(values.email)
          .then((response) => {
            if(response.message === "RESET_PASSWORD_SUCCESS") {
              setView("login");
              setIsSubmitting(false);
              return;
            }
          })
          .catch((error) => {
            setIsSubmitting(false);
            throw error;
          }),
        {
          loading:  getMessage("success", "sending"),
          success: getMessage("success", "reset_password_success"),
          error: (error) => 
            error?.message
        }
      );
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error al enviar correo:", error);
    }
    
  }

  return (
    
    <div id="container" className="h-dvh">
      <div id="top-image"></div>
      <div className="flex h-9/10 w-screen items-center justify-center">
        <Card className="absolute w-[350px]">
          <CardHeader  className="items-center justify-center">
              <CardTitle className="font-bold text-2xl">{getMessage("ui", "reset_password_card_title")}</CardTitle>
          </CardHeader>
          <CardDescription className="text-center">
            <p className="text-sm text-foreground">{getMessage("ui", "reset_password_card_subtitle")}</p>
          </CardDescription>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder={getMessage("ui", "reset_password_email_placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button onClick={() => setView("login")} variant={"tertiary"} size={"lg"}>
                      <TbArrowBackUp />{getMessage("ui", "reset_password_back")}
                    </Button>
                    <Button type="button" disabled={isSubmitting} variant={"default"} size={"lg"}>
                      <MdOutgoingMail />{isSubmitting === true ? getMessage("ui", "wait") : getMessage("ui", "reset_password_send_code")}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}