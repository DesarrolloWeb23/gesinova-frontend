"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import packageJson from '@/../package.json';
import Image from 'next/image'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/components/ui/sidebar"

export function VersionSwitcher({
    versions,
    defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
    const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Image
                  src="/Logo_Gesinova.jpg"
                  alt="Logo Gesinova"
                  width={800}
                  height={800}
                  className="h-12 w-12 rounded-full object-cover"
                />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Gesinova</span>
                <span className="">v{packageJson.version}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
