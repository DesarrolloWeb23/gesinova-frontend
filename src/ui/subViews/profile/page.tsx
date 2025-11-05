"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/ui/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/ui/components/ui/form"
import { Switch } from "@/ui/components/ui/switch"
import {
    Card,
    CardContent,
} from "@/ui/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/ui/components/ui/tabs"
import { useState, useEffect, useRef } from "react"
import  Loading  from "@/ui/components/Loading"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/components/ui/dialog"
import { RiQrCodeFill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";
import { getMessage } from "@/core/domain/messages";
import { AuthApiService } from '@/core/infrastructure/api/services/authService'
import { ActivateTwoFactor } from '@/core/domain/use-cases/ActivateTwoFactor'
import { GetUserInfo } from "@/core/domain/use-cases/GetUserInfo"
import { UserApiService } from "@/core/infrastructure/api/services/userService"
import { User } from "@/core/domain/models/User";
import { useView } from "@/ui/context/ViewContext";
import { LogoutUser } from "@/core/domain/use-cases/LogoutUser"
import { useAuth } from "@/ui/context/AuthContext";
import { DisableTwoFactor } from "@/core/domain/use-cases/DisableTwoFactor"
import { Badge } from "@/ui/components/ui/badge"
import ChangePasswordCard from "@/ui/components/ChangePasswordCard"

const FormSchema = z.object({
    admin_profile: z.boolean().optional(),
})       

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const { setView, setSubView } = useView();
    const didFetch = useRef(false);
    const { validationToken } = useAuth();

    const fetchUserData = async () => {
        const userService = new GetUserInfo(new UserApiService());
        try {
            await toast.promise( 
                userService.execute()
                .then((response) => {
                    setUser(response);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    
                    if (error?.status === "ACCESS_DENIED") {
                        setAccessDenied(true);
                        return;
                    }

                    setSubView("Dashboard");
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al cargar los datos del usuario:", error);
        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            admin_profile: user?.swAdmin === "YES" ? true : false,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
        ),
    })
    }


    const activate = (method: number) => {
        const twoFactorCase = new ActivateTwoFactor(new AuthApiService());
        
        try {
            toast.promise(
                twoFactorCase.execute(1, method)
                .then((response) => {
                    if (response.message === "TOPT_ACTIVATED") {
                        const qrWindow = window.open("", "_blank");
                        if (qrWindow) {
                            const html = `
                            <html>
                                <head>
                                <title>QR Code</title>
                                <link rel="stylesheet" href="/qr-window.css">
                                </head>
                                <body>
                                <h2>Escanea este código QR</h2>
                                <img src="${response.data.qrUri}" alt="QR Code" />
                                </body>
                            </html>
                            `
                            qrWindow.document.write(html);
                            qrWindow.document.close();
                        }
                        toast.success(getMessage("success", "mfa_qr_code"));
                    } else if (response.message === "OPT_ACTIVATED") {
                        toast.success(getMessage("success", "mfa_code_sent"));
                    } 
                    //almacena token temporal para hacer inicio de sesion nuevamente
                    validationToken(response.data.tempToken!);
                    //cierre de sesion
                    const logoutUseCase = new LogoutUser(new AuthApiService());
            
                    toast.promise(
                        logoutUseCase.execute()
                        .then((response) =>{
                            if (response.message === "LOGOUT_SUCCESS") {
                                setView("validateMfa");
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
            })
                .catch((error) => {
                    toast.error(
                    error?.data?.message
                        ? "Error: " + error.data.message
                        : getMessage("errors", "handle_error") + error.message
                    );
                })
            );
        } catch (error) {
            console.error("Error al activar el doble factor:", error);
        }
    }

    //funcion para desactivar MFA
    async function handleDisableMFA() {
        const disableMFAUseCase = new DisableTwoFactor(new AuthApiService());
        try {
            toast.promise(
                disableMFAUseCase.execute()
                    .then((response) => {
                        if (response.status === 200) {
                            fetchUserData();
                        } else {
                            throw new Error(response.message || "Disable MFA failed");
                        }
                    }), {
                    loading: "Desactivando MFA...",
                    success: "MFA desactivado correctamente",
                    error: (error) =>
                        error?.data?.message
                            ? "Error: " + error?.data?.message
                            : "Error no manejado: " + error.message,
                },
            );
        } catch (error) {
            console.error("Error al desactivar el doble factor:", error);
        }
    }

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
            <p className="mt-2 text-muted-foreground">
                No tienes permisos para acceder a esta sección.
            </p>
            <Button className="mt-4" onClick={() => setSubView("Dashboard")}>Volver</Button>
            </div>
        );
    }

    return (
        <div>
            {loading ? (
                <div className="col-span-2 max-sm:col-span-3 justify-between p-4">
                    <Loading />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4 text-foreground animate-in fade-in slide-in-from-top-8 duration-900">
                    <div className="col-span-2 max-sm:col-span-3 justify-between p-4">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative h-32 w-32">
                                <div className="flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
                                    <span className="text-4xl font-bold">
                                        {user?.name?.[0] ?? "U"}
                                        {user?.lastName?.[0] ?? ""}
                                    </span>
                                </div>
                                <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Nombre usuario */}
                            <h2 className="mt-4 font-bold">{user?.username}</h2>
                            <p>{user?.name + " " + user?.lastName}</p>
                        </div>

                        {/* Separador */}
                        <div className="my-6 border-t border-gray-200"></div>

                        {/* Información extra */}
                        <div className="space-y-2 text-center">
                            <p>{user?.email}</p>
                            <div>
                                <span className="font-semibold">Grupo:</span>
                                <ul className="list-disc list-inside space-y-1 space-x-1">
                                { user?.groups[0] ? (
                                    user.groups.map((group) => (
                                            <Badge key={group.id}  variant="secondary">{group.name}</Badge>
                                        ))
                                    ) : (
                                        <li className="text-sm text-muted-foreground">No tiene grupos asignados.</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <span className="font-semibold">Permisos:</span>
                                <ul className="list-disc list-inside space-y-1 space-x-1">
                                { user?.permissions[0] ? (
                                    user.permissions.map((permission) => (
                                            <Badge key={permission.id}  variant="secondary">{permission.name}</Badge>
                                        ))
                                    ) : (
                                        <li className="text-sm text-muted-foreground">No tiene permisos asignados.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 max-sm:col-span-3 p-4">
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <Tabs defaultValue="security">
                                <TabsList>
                                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                                    <TabsTrigger value="password">Contraseña</TabsTrigger>
                                </TabsList>
                                <TabsContent value="security">
                                    <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100">
                                        <CardContent className="grid gap-6">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                                    <div className="space-y-4">
                                                        <FormField
                                                        control={form.control}
                                                        name="admin_profile"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel>Perfil admin</FormLabel>
                                                                    <FormDescription>
                                                                        Permisos de administrador para el usuario.
                                                                    </FormDescription>
                                                                </div>
                                                                <FormControl>
                                                                    <Switch
                                                                    checked={user?.swAdmin === "YES"}
                                                                    onCheckedChange={field.onChange}
                                                                    disabled
                                                                    aria-readonly
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                        />
                                                    </div>
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Doble factor</FormLabel>
                                                            <FormDescription>
                                                                Activacion del doble factor de autenticacion.
                                                            </FormDescription>
                                                        </div>
                                                        {user?.mfaActive ? (
                                                            <Button type="button" variant={"destructive"} onClick={() => handleDisableMFA()}>Desactivar</Button>
                                                        ) : (
                                                            <Dialog>
                                                                <DialogTrigger className="rounded-lg p-1 shadow-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none" 
                                                                    disabled={user?.mfaActive}>Activar</DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                    <DialogTitle>{getMessage("ui","mfa_activation_card_title")}</DialogTitle>
                                                                    <DialogDescription className="flex justify-between mt-4 gap-1">
                                                                        <div className="text-foreground">{getMessage("ui","mfa_activation_card_subtitle")}</div>
                                                                        <Button onClick={() => activate(1)} variant={"default"}><RiQrCodeFill />QR</Button>
                                                                        <Button onClick={() => activate(2)} variant={"default"}><IoMailOutline />Codigo</Button>
                                                                    </DialogDescription>
                                                                    </DialogHeader>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </FormItem>
                                                </form>
                                            </Form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="password">
                                    <ChangePasswordCard />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}