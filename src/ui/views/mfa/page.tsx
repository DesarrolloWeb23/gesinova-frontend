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
import { ActivateTwoFactor } from '@/core/domain/use-cases/ActivateTwoFactor'
import { toast } from 'sonner'
import { Version } from "@/ui/components/Version";
import { getMessage } from "@/core/domain/messages";


export default function ActivateMfa( {setView }: { setView: (view: string) => void; }) {

  //funcion para activar el doble factor
    const activate = (method: number) => {

      const twoFactorCase = new ActivateTwoFactor(new AuthApiService());

      try {
        toast.promise(
          twoFactorCase.execute(1, method)
          .then((response) => {
            if (response.status === "TOPT_ACTIVATED") {
              const qrWindow = window.open("", "_blank");
              if (qrWindow) {
                qrWindow.document.write("<h1>QR Code</h1>");
                qrWindow.document.write("<img src='" + response.data.qrUri + "' />");
                qrWindow.document.close();
              }
              setView("login");
              toast.success(response.message);
            } else if (response.status === "OPT_ACTIVATED") {
              setView("login");
              toast.success(response.message);
            } else {
              toast.success(getMessage("success", "mfa_activation_success"));
            }
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
    <div id="container" className="flex h-screen w-screen items-center justify-center">
      <div id="top-image"></div>
      <Card className="absolute w-[350px]">
          <CardHeader  className="items-center justify-center">
              <Button onClick={() => setView("login")} className="bg-blue-500 text-white px-4 py-2 rounded">Volver</Button>
              <CardTitle className="font-bold text-2xl">Activacion de doble factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Para activar el doble factor de autenticacion, ppuedes hacerlos por QR o por codigo al correo electronico.</p>
              <div className="flex justify-between mt-4">
                  <Button onClick={() => activate(1)} className="bg-blue-500 text-white px-4 py-2 rounded">QR</Button>
                  <Button onClick={() => activate(2)} className="bg-red-500 text-white px-4 py-2 rounded">Codigo</Button>
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