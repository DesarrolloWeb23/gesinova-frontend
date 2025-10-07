import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { ValidateTwoFactor } from '@/core/domain/use-cases/ValidateTwoFactor'
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
import { useAuth } from "@/ui/context/AuthContext";
import { getMessage } from "@/core/domain/messages";
import { CodeInput } from "@/ui/components/CodeInput";
import { TbArrowBackUp } from "react-icons/tb";
import { BsCheck2Circle } from "react-icons/bs";
import { useView } from "@/ui/context/ViewContext";
import { Footer } from "@/ui/components/Footer";

const formSchema = z.object({
  code: z.string().min(6, getMessage("errors", "zod_code_required")).max(6, getMessage("errors", "zod_code_required"))
})

export default function ValidateMfa() {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorTrigger, setErrorTrigger] = useState(0);
  const { tempToken, login } = useAuth();
  const { setView } = useView();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validateMfaUseCase = new ValidateTwoFactor(new AuthApiService());

    try {
      await toast.promise(
        validateMfaUseCase.execute(tempToken, values.code)
          .then((response) => {
            login(response.data.user!, response.data.accessToken!);
            setIsSubmitting(false);
            setView("dashboard");
          })
          .catch((error) => {
            setIsSubmitting(false);
            setErrorTrigger((prev) => prev + 1); // Esto reiniciará el CodeInput
            form.setError("code", {
              type: "manual",
            });
            throw error;
          }),
        {
          loading:  getMessage("success", "access_loading"),
          success: getMessage("success", "mfa_validation_success"),
          error: (error) => 
              error?.message
        }
      );
    } catch (error) {
      console.error("Error al validar el doble factor:", error);
    } finally {
      setIsSubmitting(false);
    }
    
  }

  return (
    
    <div id="container" className="h-dvh">
      <div id="top-image"></div>
      <div className="flex h-9/10 w-screen items-center justify-center">
        <Card className="absolute w-[350px]">
          <CardHeader  className="items-center justify-center">
            <CardTitle className="font-bold text-2xl">{getMessage("ui", "mfa_validation_card_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{getMessage("ui", "mfa_validation_card_subtitle")}</p>
            <div className="flex flex-col gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <CodeInput
                            value={field.value}
                            onChange={field.onChange}
                            hasError={!!fieldState.error}
                            resetTrigger={errorTrigger}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button type="button" onClick={() => setView("login")} variant={"tertiary"} size={"lg"}>
                      <TbArrowBackUp />{getMessage("ui", "mfa_validation_back")}
                    </Button>
                    <Button type="submit" disabled={isSubmitting} variant={"default"} size={"lg"}>
                      <BsCheck2Circle />{isSubmitting === true ? getMessage("ui", "mfa_validation_wait") : getMessage("ui", "mfa_validation_send_code")}
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