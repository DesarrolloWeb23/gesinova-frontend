"use client";

import Login from "@/ui/views/login/page";
import Dashboard from "@/ui/views/dashboard/page";
import ActivateMfa from "@/ui/views/activateMfa/page";
import ValidateMfa from "@/ui/views/validateMfa/page";
import ResetPassword from "@/ui/views/resetPasswordForm/page";
import Screen from "@/ui/views/screen/page";
import { Toaster } from 'sonner'
import { setErrorMap } from "zod";
import { customZodErrorMap } from "@/ui/hooks/useZodErrorMap";
import { useView } from "@/ui/context/ViewContext";

export default function Home() {
  
  const { view } = useView();
  setErrorMap(customZodErrorMap);

  return (
    <main>
      {view === "login" && (
        <Login/>
      )}
      {view === "dashboard" && (
        <Dashboard/>
      )}
      {view === "ActivateMfa" && (
        <ActivateMfa/>
      )}
      {view === "validateMfa" && (
        <ValidateMfa/>
      )}
      {view === "resetPassword" && (
        <ResetPassword/>
      )}
      {view === "screen" && (
        <Screen/>
      )}
      <Toaster richColors position="top-right" />
    </main>
  );
}
