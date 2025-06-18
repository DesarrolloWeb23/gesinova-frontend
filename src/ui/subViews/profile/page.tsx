"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import Image from 'next/image'
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
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/ui/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/ui/components/ui/tabs"
import { useState, useEffect } from "react"
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

const FormSchema = z.object({
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
})

export default function Profile() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // solicita los datos del usuario al cargar el componente
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Simula una llamada a la API para obtener los datos del usuario
                // Aquí deberías llamar a tu servicio de autenticación o API
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula un retraso de 2 segundos
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);
    
    const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
            security_emails: true,
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
                            <style>
                            body {
                                font-family: sans-serif;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                                background: white;
                            }
                            img {
                                width: 256px;
                                height: 256px;
                                border: 1px solid #ccc;
                                border-radius: 8px;
                            }
                            </style>
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
                // setView("login");
                toast.success(getMessage("success", "mfa_qr_code"));
                } 
                
                if (response.message === "OPT_ACTIVATED") {
                // validationToken(response.data.tempToken);
                // setView("validateMfa");
                toast.success(getMessage("success", "mfa_code_sent"));
                } else {
                toast.success(getMessage("success", "mfa_activation_success"));
                }
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

    return (
        <div>
            {loading ? (
                <div className="grid grid-cols-3 gap-4 text-primary-foreground animate-in fade-in slide-in-from-top-8 duration-900">
                    <div className="col-span-2 max-sm:col-span-3 justify-between p-4">
                        <div className="flex items-center justify-center h-32 w-32 bg-gray-300 rounded-full mx-auto shadow-lg">
                            <Image
                                src="/Logo_Gesinova.jpg"
                                alt="Logo Gesinova"
                                width={800}
                                height={800}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="border-t border-gray-300 my-4"></div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold">Nombre de Usuario</h2>
                            
                                <div>
                                    <p> Fabian Rojas </p>
                                    <p> Desallorador Full Stack </p>
                                </div>
                        </div>
                    </div>
                    <div className="col-span-1 max-sm:col-span-3 p-4">
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <Tabs defaultValue="security">
                                <TabsList>
                                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                                    <TabsTrigger value="configuration">Configuracion</TabsTrigger>
                                    <TabsTrigger value="password">Contraseña</TabsTrigger>
                                </TabsList>
                                <TabsContent value="security">
                                    <Card className="border">
                                        <CardContent className="grid gap-6">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                                    <div className="space-y-4">
                                                        <FormField
                                                        control={form.control}
                                                        name="marketing_emails"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel>Doble factor</FormLabel>
                                                                    <FormDescription>
                                                                        Activacion del doble factor de autenticacion.
                                                                    </FormDescription>
                                                                </div>
                                                            <FormControl>
                                                                <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            </FormItem>
                                                        )}
                                                        />
                                                        <FormField
                                                        control={form.control}
                                                        name="security_emails"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel>Security emails</FormLabel>
                                                                    <FormDescription>
                                                                    Receive emails about your account security.
                                                                    </FormDescription>
                                                                </div>
                                                                <FormControl>
                                                                    <Switch
                                                                    checked={field.value}
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
                                                    <Dialog>
                                                        <DialogTrigger className=" rounded-lg p-1 shadow-sm bg-red-500 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none" >Activar</DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                            <DialogTitle>{getMessage("ui","mfa_activation_card_title")}</DialogTitle>
                                                            <DialogDescription>
                                                                <div className="flex justify-between mt-4 gap-1">
                                                                <p className="text-sm text-foreground">{getMessage("ui","mfa_activation_card_subtitle")}</p>
                                                                    <Button onClick={() => activate(1)} variant={"default"}><RiQrCodeFill />QR</Button>
                                                                    <Button onClick={() => activate(2)} variant={"default"}><IoMailOutline />Codigo</Button>
                                                                </div>
                                                            </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                    </FormItem>
                                                    <Button type="submit">Guardar</Button>
                                                </form>
                                            </Form>
                                        </CardContent>
                                        <CardFooter>
                                            
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="configuration">
                                    <Card className="border">
                                        <CardHeader>
                                            
                                        <CardDescription>
                                            
                                        </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-6">
                                            
                                        </CardContent>
                                        <CardFooter>
                                            
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="password">
                                    <Card className="border">
                                        <CardHeader>
                                            
                                        <CardDescription>
                                            
                                        </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-6">
                                            
                                        </CardContent>
                                        <CardFooter>
                                            
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                        
                    </div>
                </div>
            ) : (
            <div className="col-span-2 max-sm:col-span-3 justify-between p-4">
                <Loading />
            </div>
            )}
        </div>
    );
}