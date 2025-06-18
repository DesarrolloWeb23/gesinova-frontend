"use client";
import { useState,useEffect } from "react";
import Login from "@/ui/views/login/page";
import Dashboard from "@/ui/views/dashboard/page";
import ActivateMfa from "@/ui/views/activateMfa/page";
import ValidateMfa from "@/ui/views/validateMfa/page";
import ResetPassword from "@/ui/views/resetPasswordForm/page";
import { Toaster } from 'sonner'
import { setErrorMap } from "zod";
import { customZodErrorMap } from "@/ui/hooks/useZodErrorMap";

export default function Home() {
  
  const [view, setView] = useState("");
  setErrorMap(customZodErrorMap);

  useEffect(() => {
    const savedView = localStorage.getItem("currentView");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    if (savedView) {
      setView(savedView);
    } else {
      setView(token ? "dashboard" : "login");
    }
  }, []);


  return (
    <main>
      {view === "login" && (
        <Login
          setView={setView}
        />
      )}
      {view === "dashboard" && (
        <Dashboard/>
      )}
      {view === "ActivateMfa" && (
        <ActivateMfa
          setView={setView}
        />
      )}
      {view === "validateMfa" && (
        <ValidateMfa
          setView={setView}
        />
      )}
      {view === "resetPassword" && (
        <ResetPassword
          setView={setView}
        />
      )}
      <Toaster richColors position="top-right" />
    </main>
  );
}
