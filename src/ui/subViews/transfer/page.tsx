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


export default function Transfer() {
    return (
        <div className="flex-1 outline-none grid-cols-1 animate-in fade-in slide-in-from-top-8 duration-900">
            <Tabs defaultValue="start">
                <TabsList className="grid w-full grid-cols-5 border-b border-b-slate-200 dark:border-b-slate-700 bg-transparent m-1">
                    <TabsTrigger value="start">Inicio</TabsTrigger>
                    <TabsTrigger value="trigger">Generar</TabsTrigger>
                    <TabsTrigger value="manage">Gestionar</TabsTrigger>
                    <TabsTrigger value="report">Reportes</TabsTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <TabsTrigger value="more">
                                <a >...</a>
                            </TabsTrigger>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Mas opciones</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Opcion 1
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
                <TabsContent value="trigger" className="grid grid-cols-1 flex align-center justify-center">
                    <Trigger />
                </TabsContent>
                <TabsContent value="manage" className="grid grid-cols-1 flex align-center justify-center">
                    <Manage />
                </TabsContent>
            </Tabs>
        </div>
    );
}