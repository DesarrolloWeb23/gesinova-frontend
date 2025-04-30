"use client";
import { useState } from "react";
import Login from "@/ui/views/login/page";
import Dashboard from "@/ui/views/dashboard/page";
import User from "@/ui/views/user/page";
import Remember from "@/ui/views/remember/page";

export default function Home() {
  
  const [view, setView] = useState("login"); // Estado para manejar la vista actual
  const [x, setX] = useState(""); // Estado para manejar el mensaje recibido

  // Función para manejar el cambio de vista y pasar el mensaje recibido
  const handleLogin = (mensaje: string) => {
    setX(mensaje); // Guardar el mensaje recibido
    setView("dashboard"); // Cambiar a la vista de dashboard
  };

  return (
    <main>
      {view === "login" && <Login onLogin={handleLogin} onRemember={() => setView("remember")} />}
      {view === "dashboard" && <Dashboard listUser={() => setView("user")} comeBack={() => setView("login")} mensaje={x}/>}
      {view === "user" && <User comeBack={() => setView("login")}/>}
      {view === "remember" && <Remember comeBack={() => setView("login")}/>}
    </main>
  );
}
