import { Button } from "@/ui/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/ui/components/ui/avatar";
import { LogoutUser } from '@/core/domain/use-cases/LogoutUser';
import { AuthApiService } from '@/core/infrastructure/api/services/authService';
import { toast } from 'sonner';
import { useAuth } from "@/ui/context/AuthContext";
import { useView } from "../context/ViewContext";


export function DropdownProfile({setSubView} : {setSubView: (view: string) => void}) {
    const { logout } = useAuth();
    const { setView } = useView();

    //Funcion para cerrar sesión
    async function sendLogout() {
        const logoutUseCase = new LogoutUser(new AuthApiService());

        await toast.promise(
            logoutUseCase.execute()
            .then((response) =>{
                if (response.message === "LOGOUT_SUCCESS") {
                    logout();
                    setView("dashboard");
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
        <DropdownMenu>
            <Avatar className="hover:border hover:border-primary animate-in fade-in slide-in-from-right-8 duration-400">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="animate-in fade-in slide-in-from-right-8 duration-200">Mi Perfil</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Mi Perfil</DropdownMenuLabel>
                <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSubView("MiPerfil")}>
                    Gestion de perfil
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSubView("Configuracion")}>
                    Configuracion
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setSubView("MiEmpresa")}>Mi empresa</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSubView("Soportes")}>Soporte</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem  onClick={sendLogout}>
                    Cerrar sesión
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
