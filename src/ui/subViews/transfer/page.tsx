import { Button } from "@/ui/components/ui/button";
import { AuthApiService } from "@/core/infrastructure/api/services/authService";
import { Test } from "@/core/domain/use-cases/test";
import { toast } from "sonner";

export default function Transfer() {
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
        <div className="flex flex-col h-screen">
            <header className="bg-primary flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <h1 className="text-2xl font-bold text-white">Turnos</h1>
            </header>
            <main className="flex-1 p-4">
                <p className="text-lg">Bienvenido a Turnos</p>
                <Button onClick={sendSecured} className="w-40">
                    secured
                </Button>
            </main>
        </div>
    );
}