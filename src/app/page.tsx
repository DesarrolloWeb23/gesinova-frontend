"use client";
import { useState,useEffect } from "react";
import Login from "@/ui/views/login/page";
import Dashboard from "@/ui/views/dashboard/page";
import ActivateMfa from "@/ui/views/mfa/page";
import RequiredMfa from "@/ui/views/validateMfa/page";
import User from "@/ui/views/user/page";
import Remember from "@/ui/views/remember/page";
import { Toaster } from 'sonner'
import { useAuth } from "@/ui/context/AuthContext";
import { setErrorMap } from "zod";
import { customZodErrorMap } from "@/ui/hooks/useZodErrorMap";

export default function Home() {
  
  const { logout } = useAuth();
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
        <Dashboard
          listUser={() => setView("user")}
          comeBack={() => {
            logout();
            setView("login");
          }}
        />
      )}
      {view === "ActivateMfa" && (
        <ActivateMfa
          setView={setView}
        />
      )}
      {view === "requiredMfa" && (
        <RequiredMfa
          setView={setView}
        />
      )}
      {view === "user" && <User comeBack={() => setView("login")} />}
      {view === "remember" && <Remember comeBack={() => setView("login")} />}
      <Toaster richColors position="top-right" />
    </main>
  );
}
