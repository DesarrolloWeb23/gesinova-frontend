"use client"
import * as React from "react"
import { Label } from "@/ui/components/ui/label"
import { Separator } from "@/ui/components/ui/separator"
import { Button } from "@/ui/components/ui/button"
import { useFontSize } from "@/ui/context/FontSizeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/components/ui/select"
import { useTheme } from "next-themes"

export default function Configuration() {
    const { toggleFontSize, fontSize } = useFontSize();
    const { setTheme } = useTheme()

    const fontSizeLabels: Record<string, string> = {
        "text-base": "Letra normal",
        "text-lg": "Letra mediana",
        "text-xl": "Letra grande",
        "text-2xl": "Letra extra grande",
    };

    const handleContrastChange = (value: string) => {
        setTheme(value)
    };

    const handleLanguageChange = (value: string) => {
        localStorage.setItem("lang", value);
        // Refrescar la página para aplicar el cambio de idioma
        window.location.reload();
    };

    return (
        <div className="grid grid-cols-1 gap-4 text-primary-foreground animate-in fade-in slide-in-from-top-8 duration-900">
            <div className="flex flex-col gap-4 p-4">
                <h1 className="font-bold">Configuración de aplicativo</h1>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 gap-4 max-sm:grid-cols-1 max-sm:gap-2 max-sm:p-2 max-sm:justify-items-center max-sm:items-center">
                    <Label>Contraste</Label>
                    <Select onValueChange={handleContrastChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Cambiar contraste"/>
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="light" >Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 max-sm:grid-cols-1 max-sm:gap-2 max-sm:p-2 max-sm:justify-items-center max-sm:items-center">
                    <Label>Idioma</Label>
                    <Select onValueChange={handleLanguageChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Cambiar idioma"/>
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Ingles</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 max-sm:grid-cols-1 max-sm:gap-2 max-sm:p-2 max-sm:justify-items-center max-sm:items-center">
                    <Label>Tamaño de la letra</Label>
                    <div className="p-2 flex items-center space-x-2">
                        <Button onClick={toggleFontSize}>
                            {fontSizeLabels[fontSize]}
                        </Button>
                    </div>
                </div>
                <Separator className="my-4" />
            </div>
        </div>
    );
}