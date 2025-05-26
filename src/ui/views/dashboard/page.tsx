import React from "react";
import { Test } from "@/core/domain/use-cases/test";
import { toast } from 'sonner';
import { AuthApiService } from '@/core/infrastructure/api/services/authService';

export default function Dasboard({ listUser, comeBack }: { listUser: () => void, comeBack: () => void }) {

    const user = localStorage.getItem("user");
    const testUseCase = new Test(new AuthApiService());

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

    return (
        <div>
            <h1 className="text-2xl font-bold">Bienvenido {user}</h1>
            <div className="flex justify-between mt-4">
                <button onClick={listUser} className="bg-blue-500 text-white px-4 py-2 rounded">Listar Usuarios</button>
                <button onClick={comeBack} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar Sesión</button>
            </div>
            <div className="mt-4">
                <button onClick={sendSecured} className="bg-red-500 text-white px-4 py-2 rounded">secured</button>
            </div>
        </div>
        );
    }