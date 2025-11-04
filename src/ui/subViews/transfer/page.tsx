import { useState } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/ui/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import Trigger from "@/ui/subViews/transfer/trigger";
import Manage from "@/ui/subViews/transfer/manage";
import CreateAttentionService from "@/ui/subViews/transfer/create-attention-service";
import Report from "@/ui/subViews/transfer/report";
import { TbDeviceDesktopShare } from "react-icons/tb";
import { PiLecternBold } from "react-icons/pi";
import { useView } from "@/ui/context/ViewContext";

export default function Transfer() {
    const [tab, setTab] = useState("trigger");
    const { setView } = useView();

    return (
        <div className="flex-1 outline-none grid-cols-1 animate-in fade-in slide-in-from-top-8 duration-900">
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-4 border-b border-b-slate-200 dark:border-b-slate-700 bg-transparent m-1">
                    <TabsTrigger value="trigger">Generar</TabsTrigger>
                    <TabsTrigger value="manage">Gestionar</TabsTrigger>
                    <TabsTrigger value="report">Reportes</TabsTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="hover:cursor-pointer">
                            <div className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1">
                                <a >Mas opciones</a>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <TabsTrigger value="create-attention-service">
                                        Crear servicio de atención
                                    </TabsTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>Configuracion</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Mas opciones</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem><TbDeviceDesktopShare className="w-7 h-7"/>Pantalla</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setView("lectern")}><PiLecternBold className="w-7 h-7"/>Atril</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TabsList>
                <TabsContent value="trigger" className="grid grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
                    <Trigger />
                </TabsContent>
                <TabsContent value="manage" className="grid grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
                    <Manage />
                </TabsContent>
                <TabsContent value="report" className="grid grid-cols-1">
                    <Report />
                </TabsContent>
                <TabsContent value="create-attention-service" className="grid grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
                    <CreateAttentionService />
                </TabsContent>
            </Tabs>
        </div>
    );
}