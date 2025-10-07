import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { ActivateTwoFactor } from '@/core/domain/use-cases/ActivateTwoFactor'
import { toast } from 'sonner'
import { getMessage } from "@/core/domain/messages";
import { TbArrowBackUp } from "react-icons/tb";
import { RiQrCodeFill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { useAuth } from "@/ui/context/AuthContext";
import { useView } from "@/ui/context/ViewContext";
import { Footer } from "@/ui/components/Footer";


export default function ActivateMfa() {

  const { validationToken } = useAuth();
  const { setView } = useView();
  //funcion para activar el doble factor
  const activate = (method: number) => {

    const twoFactorCase = new ActivateTwoFactor(new AuthApiService());

    try {
      toast.promise(
        twoFactorCase.execute(1, method)
        .then((response) => {
          if (response.message === "TOPT_ACTIVATED") {
            const qrWindow = window.open("", "_blank");
              if (qrWindow) {
                const html = `
                  <html>
                    <head>
                      <title>QR Code</title>
                      <style>
                        body {
                          font-family: sans-serif;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          height: 100vh;
                          margin: 0;
                          background: white;
                        }
                        img {
                          width: 256px;
                          height: 256px;
                          border: 1px solid #ccc;
                          border-radius: 8px;
                        }
                      </style>
                    </head>
                    <body>
                      <h2>Escanea este código QR</h2>
                      <img src="${response.data.qrUri}" alt="QR Code" />
                    </body>
                  </html>
                `
                qrWindow.document.write(html);
              qrWindow.document.close();
            }
            toast.success(getMessage("success", "mfa_qr_code"));
          } else if (response.message === "OPT_ACTIVATED") {
            toast.success(getMessage("success", "mfa_code_sent"));
          } else {
            toast.success(getMessage("success", "mfa_activation_success"));
          }

          validationToken(response.data.tempToken!);
          setView("validateMfa");
        })
        .catch((error) => {
          toast.error(
            error?.data?.message
              ? "Error: " + error.data.message
              : getMessage("errors", "handle_error") + error.message
          );
        })
      );
    } catch (error) {
      console.error("Error al activar el doble factor:", error);
    }
  }

  return (
    <div id="container" className="h-dvh">
      <div id="top-image"></div>
      <div className="flex h-9/10 w-screen items-center justify-center">
        <Card className="absolute w-[350px]">
            <CardHeader  className="items-center justify-center">
                <Button onClick={() => setView("login")} className="w-10" variant={"tertiary"}><TbArrowBackUp /></Button>
                <CardTitle className="font-bold text-2xl">{getMessage("ui","mfa_activation_card_title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{getMessage("ui","mfa_activation_card_subtitle")}</p>
                <div className="flex justify-between mt-4">
                    <Button onClick={() => activate(1)} variant={"default"}><RiQrCodeFill />QR</Button>
                    <Button onClick={() => activate(2)} variant={"default"}><IoMailOutline />Codigo</Button>
                </div>
              </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}