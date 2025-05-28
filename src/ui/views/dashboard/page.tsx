import React from "react";
import { Test } from "@/core/domain/use-cases/test";
import { toast } from 'sonner';
import { AuthApiService } from '@/core/infrastructure/api/services/authService';
import { LogoutUser } from '@/core/domain/use-cases/LogoutUser'
import { useAuth } from "@/ui/context/AuthContext";
import { Button } from "@/ui/components/ui/button";

export default function Dasboard({ listUser, comeBack }: { listUser: () => void, comeBack: () => void }) {

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
        <div>
            <h1 className="text-2xl font-bold">Bienvenido {user}</h1>
            <div className="flex justify-between mt-4">
                <button onClick={listUser} className="bg-blue-500 text-white px-4 py-2 rounded">Listar Usuarios</button>
                <button onClick={sendLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
            </div>
            <div className="mt-4">
                <Button onClick={sendSecured} className="w-40">
                    secured
                </Button>
            </div>
        </div>
        );
    }