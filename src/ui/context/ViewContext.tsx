"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { GetUserInfo } from "@/core/domain/use-cases/GetUserInfo";
import { UserApiService } from "@/core/infrastructure/api/services/userService";

type ViewContextType = {
    view: string;
    subView: string;
    setView: (v: string) => void;
    setSubView: (v: string) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [view, setView] = useState("");
    const [subView, setSubView] = useState("");
    const { logout } = useAuth();

    useEffect(() => {
                                            
        const validateToken = async () => {
            const savedView = localStorage.getItem("currentView");
            const token = localStorage.getItem("token") || sessionStorage.getItem("token")

            if (!token) {
                setView("login");
                return;
            }

            try {
                const userService = new GetUserInfo(new UserApiService());
                const res = await userService.execute()

                if (res) {
                    if (savedView) {setView(savedView);} 
                    setView("dashboard");
                } else {
                    logout();
                    setView("login");
                }
            } catch (error) {
                toast.error((error as Error).message || "Error al validar el token");
                sessionStorage.removeItem("token"); 
                localStorage.removeItem("token"); 
                setView("login");
            }
        };

        validateToken();

    }, []);

    useEffect(() => {
        if (subView) {
            sessionStorage.setItem("SubView", subView);
        }
    }, [subView]); 

    return (
        <ViewContext.Provider value={{ view, subView, setView, setSubView }}>
        {children}
        </ViewContext.Provider>
    );
};

export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView debe usarse dentro de un ViewProvider");
    }
    return context;
};