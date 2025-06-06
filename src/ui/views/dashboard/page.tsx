import React from "react";
import { Test } from "@/core/domain/use-cases/test";
import { toast } from 'sonner';
import { AuthApiService } from '@/core/infrastructure/api/services/authService';
import { LogoutUser } from '@/core/domain/use-cases/LogoutUser'
import { useAuth } from "@/ui/context/AuthContext";
import { Button } from "@/ui/components/ui/button";
import {AppSidebar} from "@/ui/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/ui/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/ui/components/ui/breadcrumb"
import { Separator } from "@/ui/components/ui/separator"

export default function Dasboard({ comeBack }: {  comeBack: () => void }) {

    const user = localStorage.getItem("user");
    const testUseCase = new Test(new AuthApiService());
    const { logout } = useAuth();


    async function sendSecured() {
        await toast.promise(
            testUseCase.execute(), {
            loading: "Cargando...",
            success: "✅ Petición segura exitosa",
            error: (error) => 
                error?.data?.message 
                ? "Error: " + error?.data?.message
                : "Error no manejado: " + error.message,
            },
        );
    }

    //Funcion para cerrar sesión
    async function sendLogout() {
        const logoutUseCase = new LogoutUser(new AuthApiService());

        await toast.promise(
            logoutUseCase.execute()
            .then((response) =>{
                if (response.status === "LOGOUT_SUCCESS") {
                    logout();
                    comeBack();
                    return;
                }else {
                    throw new Error(response.message || "Logout failed");
                }
            }), {
            loading: "Cerrando sesión...",
            success: "Sesión cerrada correctamente",
            error: (error) => 
                error?.data?.message 
                ? "Error: " + error?.data?.message
                : "Error no manejado: " + error.message,
            },
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-primary flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <h1 className="text-2xl font-bold">Bienvenido {user}</h1>
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Button onClick={sendLogout} className="ml-auto accent text-white px-4 py-2 rounded">
                        Cerrar Sesión
                    </Button>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                        <Button onClick={sendSecured} className="w-40">
                            secured
                        </Button>
                    </div>
                    <div className="bg-primary min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}