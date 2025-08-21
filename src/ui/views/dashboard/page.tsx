import React from "react";
import {AppSidebar} from "@/ui/components/Sidebar";
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
import SubDashboard from "@/ui/subViews/dashboard/page";
import Transfer from "@/ui/subViews/transfer/page";
import Profile from "@/ui/subViews/profile/page";
import Configuracion from "@/ui/subViews/configuration/page";
import Company from "@/ui/subViews/company/page";
import Support from "@/ui/subViews/support/page";
import { MdNotificationsActive } from "react-icons/md";
import { useView } from "@/ui/context/ViewContext";
import { decodeJwt, JwtPayload } from "@/lib/jwt";

const subViewsMap: Record<string, React.ComponentType> = {
    dashboard: SubDashboard,
    turnos: Transfer,
    mi_perfil: Profile,
    configuracion: Configuracion,
    mi_empresa: Company,
    soportes: Support,
    // aqui se agregan las demás vistas
};

export default function Dashboard() {
    const { subView, setSubView } = useView();
    const user = sessionStorage.getItem("user");
    const SubViewComponent = subViewsMap[subView];
    const [notificationCount, setNotificationCount] = useState(0);
    // const { usertoken } = useAuth();
    const [accessDenied, setAccessDenied] = useState(false);

    //funcion que simula la obtención de notificaciones
    const fetchNotifications = () => {
        // Simula una llamada a la API para obtener notificaciones
        const notifications = Math.floor(Math.random() * 10); // Simula entre 0 y 9 notificaciones
        setNotificationCount(notifications);
    }

    //funcion para validar que tiene los permisos para ingresar
    const validateUserPermissions = (subView: string | null) => {
        setAccessDenied(false);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        let usertoken: JwtPayload | null;

        if (token) {
            usertoken = decodeJwt(token);
        } else {
            usertoken = null;
        }

        if (usertoken) {
            if (subView && subView !== "dashboard") {
                //recorrer los permisos del usuario y validar si tiene acceso a la vista
                const hasAccess = usertoken.permissions.includes(subView);
                if (!hasAccess) {
                    setAccessDenied(true);
                }
            }
        }
    };

    useEffect(() => {
        const savedView = sessionStorage.getItem("SubView");
        fetchNotifications(); // Llama a la función para obtener notificaciones al cargar el componente

        if (savedView) {
            setSubView(savedView);
        } else {
            setSubView("dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (subView) {
            sessionStorage.setItem("SubView", subView);
            //validateUserPermissions(subView);
        }
    }, [subView]); 


    return (
        <SidebarProvider>
            <AppSidebar setSubView={setSubView} />
            <SidebarInset>
                <header className="bg-primary flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="font-bold max-sm:text-xs">Bienvenido {user}</h1>
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
                                    Dashboard
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
                        {accessDenied ? 
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
                                <p className="mt-2 text-muted-foreground">
                                    No tienes permisos para acceder a esta sección.
                                </p>
                            </div> 
                        : SubViewComponent ? <SubViewComponent /> : <p>Vista no encontrada</p>}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}