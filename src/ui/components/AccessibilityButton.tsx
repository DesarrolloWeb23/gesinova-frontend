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
import { getMessage } from "@/core/domain/messages";
import { TbDeviceDesktopShare } from "react-icons/tb";
import { PiLecternBold } from "react-icons/pi";
import { IoAccessibility } from "react-icons/io5";
import { useView } from "@/ui/context/ViewContext";

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setTheme } = useTheme()
    const { setView } = useView();

    const handleLanguageChange = (lang: string) => {
        localStorage.setItem("lang", lang);
        //refrescar la página para aplicar el cambio de idioma
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Opciones de Accesibilidad">
                <IoAccessibility />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>{getMessage("ui", "accessibility_button")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>{getMessage("ui", "accessibility_button_light")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>{getMessage("ui", "accessibility_button_dark")}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme("system")}>{getMessage("ui", "accessibility_button_system")}</DropdownMenuItem>
                </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
                {getMessage("ui", "accessibility_button_spanish")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                {getMessage("ui", "accessibility_button_english")}
            </DropdownMenuItem>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>{getMessage("ui", "accessibility_button_more")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={()=>{setView("screen")}}><TbDeviceDesktopShare className="w-7 h-7"/>{getMessage("ui", "accessibility_button_screen")}</DropdownMenuItem>
                    <DropdownMenuItem><PiLecternBold className="w-7 h-7"/>{getMessage("ui", "accessibility_button_podium")}</DropdownMenuItem>
                </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    );
}