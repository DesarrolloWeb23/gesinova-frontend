"use client";
import { createContext, useContext, useState } from "react";
import { User } from "@/core/domain/models/User";
import { CheckedState } from "@radix-ui/react-checkbox";

interface AuthContextType {
  login: (user: User, token: string) => void;
  logout: () => void;
  validationToken: (token: string) => void;
  tempToken: string | null;
  handleRememberMeChange: (checked: CheckedState) => void;
  rememberMe: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const validationToken = (tempToken: string) => {
    setTempToken(tempToken);
  };

  const handleRememberMeChange = (checked: CheckedState) => {
    setRememberMe(checked === true);
    localStorage.setItem("rememberMe", String(checked));
  }

  const login = (user: User, token: string) => {
    const fullName = capitalizeFullName(`${user.name} ${user.lastName}`);
    sessionStorage.setItem("user", fullName);

    if (rememberMe) {
    localStorage.setItem("token", token); // Guarda el token solo si eligió "recordarme"
    } else {
      sessionStorage.setItem("token", token); // O usa sessionStorage (se borra al cerrar el navegador)
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    if (rememberMe) {
      localStorage.removeItem("token"); 
    } else {
      sessionStorage.removeItem("token"); 
    }
    setTempToken(null);
    setRememberMe(false);
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("rememberMe");
    window.location.href = "/";
  };

  function capitalizeFullName(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .filter(word => word.trim() !== "") // evitar dobles espacios
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <AuthContext.Provider value={{ login, logout, validationToken, tempToken, handleRememberMeChange, rememberMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};