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
import { Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogTrigger } from "@/ui/components/ui/dialog";
import { BiMessageError } from "react-icons/bi";
import Support from "@/ui/subViews/support/page";

export function AccessibilityButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setTheme } = useTheme()
    const { view, setView } = useView();

    const handleLanguageChange = (lang: string) => {
        localStorage.setItem("lang", lang);
        //refrescar la página para aplicar el cambio de idioma
        window.location.reload();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
            <Button 
                variant="outline" size="icon" 
                aria-label="Opciones de Accesibilidad"
                className="rounded-l-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            >
                <IoAccessibility />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="rounded-xl p-2 shadow-lg backdrop-blur-md bg-white/90 dark:bg-gray-900/80"
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
            <DropdownMenuItem onClick={() => handleLanguageChange("es")}>
                {getMessage("ui", "accessibility_button_spanish")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                {getMessage("ui", "accessibility_button_english")}
            </DropdownMenuItem>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>{getMessage("ui", "accessibility_button_more")}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-lg">
                    <DropdownMenuItem onClick={()=>{setView("screen")}}><TbDeviceDesktopShare className="w-7 h-7"/>{getMessage("ui", "accessibility_button_screen")}</DropdownMenuItem>
                    <DropdownMenuItem><PiLecternBold className="w-7 h-7"/>{getMessage("ui", "accessibility_button_podium")}</DropdownMenuItem>
                </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>

        {view !== 'login' ? (
            <></>
            ) : (
            <DropdownMenu>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" size="icon" 
                            aria-label="Opciones de Accesibilidad"
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
            </DropdownMenu>)}
        </div>
    );
}