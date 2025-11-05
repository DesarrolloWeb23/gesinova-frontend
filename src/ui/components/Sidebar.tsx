import * as React from "react"
import { VersionSwitcher } from "@/ui/components/version-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/ui/components/ui/sidebar"
import { TbTransfer } from "react-icons/tb"
import { FaPaperclip } from "react-icons/fa"
import { TbDeviceComputerCamera } from "react-icons/tb"
import { TbDeviceDesktopQuestion } from "react-icons/tb"
import { MdLiveHelp } from "react-icons/md"
import TreeChristmas from "./TreeChristmas"

export function AppSidebar({
    setSubView, 
    ...props
}: React.ComponentProps<typeof Sidebar> & { setSubView: (view: string) => void; }) {
    return (
        <Sidebar {...props} className="animate-in fade-in slide-in-from-left-8 duration-350">
            <VersionSwitcher
            versions={["1.0.1"]}
            defaultVersion={"1.0.1"}
            />
            <SidebarContent>
                <SidebarGroup key="main">
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key="turnos">
                                <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("Turnos")}> 
                                <a ><TbTransfer />Turnos</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Papelería">
                                <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("stationery")}>
                                <a><FaPaperclip />Papelería</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Elementos Tecnologicos">
                                <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("technologicalElements")}>
                                <a><TbDeviceComputerCamera />Elementos Tecnologicos</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="EQS">
                                <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("eqs")}>
                                <a><TbDeviceDesktopQuestion />EQS</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem key="Soportes">
                                <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("supports")}>
                                <a><MdLiveHelp />Soportes</a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            





            </SidebarContent>
            <SidebarRail />
            <TreeChristmas />
        </Sidebar>
    )
}
