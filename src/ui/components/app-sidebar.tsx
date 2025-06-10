import * as React from "react"

import { SearchForm } from "@/ui/components/search-form"
import { VersionSwitcher } from "@/ui/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/ui/components/ui/sidebar"

export function AppSidebar({
  setSubView, 
  ...props
}: React.ComponentProps<typeof Sidebar> & { setSubView: (view: string) => void; }) {
    return (
        <Sidebar {...props}>
        <SidebarHeader>
            <VersionSwitcher
            versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
            defaultVersion={"1.0.1"}
            />
            <SearchForm />
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup key="main">
                <SidebarGroupLabel>Menú</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                      <SidebarMenuItem key="turnos">
                          <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("turnos")}> 
                          <a >Turnos</a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key="Papelería">
                          <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("stationery")}>
                          <a>Papelería</a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key="Elementos Tecnologicos">
                          <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("technologicalElements")}>
                          <a>Elementos Tecnologicos</a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key="EQS">
                          <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("eqs")}>
                          <a>EQS</a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem key="Soportes">
                          <SidebarMenuButton asChild isActive={false} onClick={() => setSubView("supports")}>
                          <a>Soportes</a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
        </Sidebar>
    )
}
