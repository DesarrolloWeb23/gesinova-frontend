import React from "react";
import {AppSidebar} from "@/ui/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/ui/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/ui/components/ui/breadcrumb"
import { Separator } from "@/ui/components/ui/separator"
import { DropdownProfile } from "@/ui/components/DropDownProfile";
import { useState, useEffect } from "react";
import Dashboard from "@/ui/subViews/dasboard/page";
import Transfer from "@/ui/subViews/transfer/page";
import Profile from "@/ui/subViews/profile/page";
import { MdNotificationsActive } from "react-icons/md";

const subViewsMap: Record<string, React.ComponentType> = {
    dashboard: Dashboard,
    turnos: Transfer,
    mi_perfil: Profile,
    // aqui se agregan las demás vistas
};

export default function Dasboard() {
    const [subView, setSubView] = useState("");
    const user = sessionStorage.getItem("user");
    const SubViewComponent = subViewsMap[subView];
    const [notificationCount, setNotificationCount] = useState(0);

    //funcion que simula la obtención de notificaciones
    const fetchNotifications = () => {
        // Simula una llamada a la API para obtener notificaciones
        const notifications = Math.floor(Math.random() * 10); // Simula entre 0 y 9 notificaciones
        setNotificationCount(notifications);
    }

    useEffect(() => {
        const savedView = sessionStorage.getItem("SubView");
        fetchNotifications(); // Llama a la función para obtener notificaciones al cargar el componente

        if (savedView) {
            setSubView(savedView);
        } else {
            setSubView("dashboard");
        }
    }, []);

    useEffect(() => {
        if (subView) {
            sessionStorage.setItem("SubView", subView);
        }
    }, [subView]); 


    return (
        <SidebarProvider>
            <AppSidebar setSubView={setSubView} />
            <SidebarInset>
                <header className="bg-primary flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="text-2xl font-bold max-sm:text-xs">Bienvenido {user}</h1>
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="ml-auto accent text-white px-4 py-2 rounded"></div>
                    <div className="flex items-center gap-2  hover:animate-vibrate animate-in fade-in slide-in-from-right-8 duration-800">
                        <MdNotificationsActive className="text-black text-2xl dark:text-white vibrate-on-hover" />
                        <span className={notificationCount ? "bg-red-500 text-white rounded-full px-2 py-1 text-xs" : "display-none"}>{notificationCount ? notificationCount : ""}</span>
                    </div>
                    <DropdownProfile setSubView={setSubView}/>
                </header>

                <div className="flex flex-1 flex-col gap-1 p-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => setSubView("dashboard")} className="hover:cursor-pointer">
                                    Dasboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            { subView === "dashboard" ? null : (
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={() => setSubView(subView)} className="hover:cursor-pointer">
                                        {subView.charAt(0).toUpperCase() + subView.slice(1).replace(/_/g, " ")}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="bg-primary min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-1 shadow-lg shadow-blue-500/50">
                        {SubViewComponent ? <SubViewComponent /> : <p>Vista no encontrada</p>}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}