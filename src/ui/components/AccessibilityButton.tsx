"use client";
import * as React from "react";
import { Button } from "@/ui/components/ui/button"; // Asume que tienes el componente Button de Shadcn UI
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger, 
} from "@/ui/components/ui/dropdown-menu"; // Para el menú desplegable
import { useTheme } from "next-themes"

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setTheme } = useTheme()

    const handleLanguageChange = (lang: string) => {
        localStorage.setItem("lang", lang);
        //refrescar la página para aplicar el cambio de idioma
        window.location.reload();
    };

    const handleAccessibilityOptions = () => {
        alert("Abriendo opciones de accesibilidad avanzadas...");
        // Lógica para abrir un modal o una página de opciones de accesibilidad
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Opciones de Accesibilidad">
                {/* Puedes usar un icono aquí, por ejemplo de Lucide React */}
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-accessibility"
                >
                <circle cx="12" cy="12" r="10" />
                <path d="M16.5 7.5c-.9-.9-2.1-1.5-3.5-1.5-1.4 0-2.6.6-3.5 1.5" />
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M16 13.5v1.4c0 .8-.5 1.6-1.3 2.1l-2.4 1.4c-.8.5-1.9.5-2.7 0L8.3 17c-.8-.5-1.3-1.3-1.3-2.1v-1.4" />
                </svg>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>Cambiar contraste</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
                Idioma: Español
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                Idioma: Inglés
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAccessibilityOptions}>
                Más Opciones
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    );
}