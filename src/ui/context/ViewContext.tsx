"use client"
import React, { createContext, useContext, useState, useEffect } from "react";

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

    useEffect(() => {
        const savedView = localStorage.getItem("currentView");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        if (savedView) {
            setView(savedView);
        } else {
            setView(token ? "dashboard" : "login");
        }
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