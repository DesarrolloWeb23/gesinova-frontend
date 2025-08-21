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
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import Trigger from "@/ui/subViews/transfer/trigger";
import Manage from "@/ui/subViews/transfer/manage";
import Start from "@/ui/subViews/transfer/start";
import CreateAttentionService from "@/ui/subViews/transfer/create-attention-service";

export default function Transfer() {
    const [tab, setTab] = useState("start")

    return (
        <div className="flex-1 outline-none grid-cols-1 animate-in fade-in slide-in-from-top-8 duration-900">
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-5 border-b border-b-slate-200 dark:border-b-slate-700 bg-transparent m-1">
                    <TabsTrigger value="start">Inicio</TabsTrigger>
                    <TabsTrigger value="trigger">Generar</TabsTrigger>
                    <TabsTrigger value="manage">Gestionar</TabsTrigger>
                    <TabsTrigger value="report">Reportes</TabsTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm">
                                <a >...</a>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Mas opciones</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <TabsTrigger value="create-attention-service">
                                        Crear servicio de atención
                                    </TabsTrigger>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Opcion 2</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Sub opcion 1</DropdownMenuItem>
                                        <DropdownMenuItem>Sub opcion 2</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Mas...</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>Opcion 3</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TabsList>
                <TabsContent value="start">
                    <Start />
                </TabsContent>
                <TabsContent value="trigger" className="grid grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
                    <Trigger />
                </TabsContent>
                <TabsContent value="manage" className="grid grid-cols-1 flex align-center justify-center">
                    <Manage />
                </TabsContent>
                <TabsContent value="create-attention-service" className="grid grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
                    <CreateAttentionService />
                </TabsContent>
            </Tabs>
        </div>
    );
}