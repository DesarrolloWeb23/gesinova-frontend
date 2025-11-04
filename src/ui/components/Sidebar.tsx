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
    <svg
      id="tree"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1694.2 483.2 199.3 285.2"
      className="w-full max-w-xs mx-auto"
    >
      <style>
        {`
          .st0{fill:#332C28;}
          .st1{fill:#00513E;}
          .st2{fill:#003828;}
          .st3{fill:#386FB1;}
          .st4{fill:#28527C;}
          .st5{fill:#EA385C;}
          .st6{fill:#E7B75C;}
          .st7{fill:#B28947;}

          /* Lights animations */
          .red { fill:#B22A45; animation:red-flash .6s ease-in-out infinite; }
          @keyframes red-flash {
            40% { fill:#EA385C; }
            80% { fill:#B22A45; }
          }

          .gold-lt { fill:#B28E49; animation:gold-lt-flash .6s ease-in-out infinite; }
          @keyframes gold-lt-flash {
            40% { fill:#E7B75C; }
            80% { fill:#B28E49; }
          }

          .blue-lt { fill:#2B568B; animation:blue-lt-flash .6s ease-in-out infinite; }
          @keyframes blue-lt-flash {
            40% { fill:#386FB1; }
            80% { fill:#2B568B; }
          }

          .blue-dk { fill:#1E3F61; animation:blue-dk-flash .6s ease-in-out infinite; }
          @keyframes blue-dk-flash {
            40% { fill:#28527C; }
            80% { fill:#1E3F61; }
          }

          .gold-dk { fill:#8C6D39; animation:gold-dk-flash .6s ease-in-out infinite; }
          @keyframes gold-dk-flash {
            40% { fill:#B28947; }
            80% { fill:#8C6D39; }
          }

          .g1 { animation-delay: 0s; }
          .g2 { animation-delay: .4s; }
          .g3 { animation-delay: .8s; }
        `}
      </style>

      <g id="tree">
        <rect x="-1605.6" y="697.1" className="st0" width="21.7" height="71.3" />
        <polygon
          className="st1"
          points="-1656.1 616.8 -1634.8 612 -1670.6 676.1 -1648.5 671.1 -1694.2 753 -1595 730.5 -1595 507.4"
        />
        <polygon
          className="st2"
          points="-1494.9 753 -1540.6 671.1 -1518.5 676.1 -1554.4 612 -1533.1 616.8 -1594.7 506.8 -1595 507.4 -1595 730.5 -1594.7 730.4"
        />
      </g>

      <g id="lights">
        <g id="blue-lt">
          <circle className="blue-lt g1" cx="-1575" cy="706.1" r="9" />
          <circle className="blue-lt g2" cx="-1621.3" cy="641" r="7" />
          <circle className="blue-lt g3" cx="-1665.5" cy="732.8" r="7" />
          <circle className="blue-lt g1" cx="-1600.3" cy="668.5" r="7" />
        </g>

        <g id="blue-dk">
          <circle className="blue-dk g3" cx="-1578.3" cy="570.8" r="7" />
          <circle className="blue-dk g1" cx="-1538" cy="718.6" r="7" />
          <circle className="blue-dk g2" cx="-1594.8" cy="610.3" r="7" />
        </g>

        <g id="red">
          <circle className="red g1" cx="-1635.6" cy="681.7" r="9" />
          <circle className="red g1" cx="-1570.3" cy="634" r="9" />
          <circle className="red g2" cx="-1607.3" cy="711.6" r="7" />
        </g>

        <g id="gold-lt">
          <circle className="gold-lt g1" cx="-1612.3" cy="585.8" r="9" />
          <circle className="gold-lt g2" cx="-1631.6" cy="705.6" r="7" />
        </g>

        <g id="gold-dk">
          <circle className="gold-dk g2" cx="-1572.3" cy="604.7" r="7" />
          <circle className="gold-dk g3" cx="-1561.3" cy="681.7" r="7" />
        </g>
      </g>

      <polygon
        className="st6"
        points="-1600.5 499.9 -1618.1 499.9 -1603.8 510.3 -1609.3 527 -1595 516.7 -1595 483.2"
      />
      <polygon
        className="st7"
        points="-1572 499.9 -1589.6 499.9 -1595 483.2 -1595 516.7 -1580.8 527 -1586.2 510.3"
      />
    </svg>
        </Sidebar>
    )
}
