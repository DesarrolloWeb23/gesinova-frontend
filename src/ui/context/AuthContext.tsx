"use client";
import { createContext, useContext, useState } from "react";
import { User } from "@/core/domain/models/User";

interface AuthContextType {
  login: (user: User, token: string) => void;
  logout: () => void;
  validationToken: (token: string) => void;
  tempToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tempToken, setTempToken] = useState<string | null>(null);

  const validationToken = (tempToken: string) => {
    setTempToken(tempToken);
  };

  const login = (user: User, token: string) => {
    const fullName = capitalizeFullName(`${user.name} ${user.lastName}`);
    sessionStorage.setItem("user", fullName);
    sessionStorage.setItem("token", token);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token"); 
    setTempToken(null);
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
    <AuthContext.Provider value={{ login, logout, validationToken, tempToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};