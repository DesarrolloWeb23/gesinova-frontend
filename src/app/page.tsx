"use client";
import { useState } from "react";
import Login from "@/ui/views/login/page";
import Dashboard from "@/ui/views/dashboard/page";
import User from "@/ui/views/user/page";

export default function Home() {
  
  const [view, setView] = useState("login"); // Estado para manejar la vista actual

  return (
    <main>
      {view === "login" && <Login onLogin={() => setView("dashboard")} />}
      {view === "dashboard" && <Dashboard listUser={() => setView("user")} comeBack={() => setView("login")}/>}
      {view === "user" && <User comeBack={() => setView("login")}/>}
    </main>
  );
}
