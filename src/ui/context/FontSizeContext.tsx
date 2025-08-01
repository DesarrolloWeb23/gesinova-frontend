"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "text-base" | "text-lg" | "text-xl" | "text-2xl";

interface FontSizeContextProps {
    fontSize: FontSize;
    toggleFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextProps | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
    const [fontSize, setFontSize] = useState<FontSize>("text-base");

    useEffect(() => {
        const saved = localStorage.getItem("font-size");
        if (saved === "text-lg" || saved === "text-xl" || saved === "text-base" || saved === "text-2xl") {
        setFontSize(saved);
        }
    }, []);

    const toggleFontSize = () => {
        // Ciclo de tamaños de letra
        const nextSize: FontSize =
        fontSize === "text-base"
            ? "text-lg"
            : fontSize === "text-lg"
            ? "text-xl"
            : fontSize === "text-xl"
            ? "text-2xl"
            : "text-base"; // reinicia el ciclo
        setFontSize(nextSize);
        localStorage.setItem("font-size", nextSize);
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, toggleFontSize }}>
        <div className={fontSize}>
            {children}
        </div>
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => {
    const context = useContext(FontSizeContext);
    if (!context) throw new Error("useFontSize debe estar dentro de FontSizeProvider");
    return context;
};