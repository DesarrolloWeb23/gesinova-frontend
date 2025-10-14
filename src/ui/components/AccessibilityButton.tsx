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
import { IoAccessibility } from "react-icons/io5";
import { Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogTrigger } from "@/ui/components/ui/dialog";
import { BiMessageError } from "react-icons/bi";
import Support from "@/ui/subViews/support/page";
import { useFontSize } from "../context/FontSizeContext";
import HoverSpeechToggle from "./HoverSpeechToggle";

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setTheme } = useTheme()
    const { toggleFontSize, fontSize } = useFontSize();

    const fontSizeLabels: Record<string, string> = {
        "text-base": "Letra normal",
        "text-lg": "Letra mediana",
        "text-xl": "Letra grande",
        "text-2xl": "Letra extra grande",
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
            <Button 
                variant="outline" size="icon" 
                aria-label="Opciones de Accesibilidad"
                title="Opciones de Accesibilidad"
                className="rounded-l-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            >
                <IoAccessibility />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            align="end"
            sideOffset={8}
            >
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>{getMessage("ui", "accessibility_button")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-lg">
                    <DropdownMenuItem onClick={() => setTheme("light")}>{getMessage("ui", "accessibility_button_light")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>{getMessage("ui", "accessibility_button_dark")}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme("system")}>{getMessage("ui", "accessibility_button_system")}</DropdownMenuItem>
                </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={toggleFontSize}>
                {fontSizeLabels[fontSize]}
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <HoverSpeechToggle />
        </DropdownMenu>

        <DropdownMenu>
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" size="icon" 
                        aria-label="Soporte Técnico"
                        title="Soporte Técnico"
                        className="rounded-l-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                    >
                        <BiMessageError />
                    </Button>
                </DialogTrigger>
                <DialogContent className="grid grid-cols-1 bg-black/50 backdrop-blur-sm flex flex-wrap md:flex-nowrap align-center justify-center sm:max-w-[1200px] p-1">
                    <DialogHeader>
                    <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <Support />
                </DialogContent>
            </Dialog>
        </DropdownMenu>
        </div>
    );
}