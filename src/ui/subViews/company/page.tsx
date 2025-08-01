"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/ui/components/ui/button"
import {
    Form,
    FormControl,
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
import { useState, useEffect } from "react"
import  Loading  from "@/ui/components/Loading"
import { RiQrCodeFill } from "react-icons/ri";
import * as React from "react"
import Permitions from "@/ui/subViews/company/permitions";


const FormSchema = z.object({
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
})

//Listado de vistas secundarias
const subViewsMap: Record<string, (props: { setView: (view: string) => void; }) => React.ReactNode> = {
    permisos: (props) => <Permitions {...props} />,
};

export default function Company() {
    const [loading, setLoading] = useState(true);
    const [subView, setSubView] = useState("");
    const SubViewComponent = subView ? subViewsMap[subView] : null;

    useEffect(() => {
        const savedView = sessionStorage.getItem("company_SubView");

        if (savedView) {
            setSubView(savedView);
        } else {
            setSubView("");
        }

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
                setLoading(true);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        if (subView) {
            sessionStorage.setItem("company_SubView", subView);
        }
    }, [subView]); 

    const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
            security_emails: true,
        },
    })

    return (
        <>
        {SubViewComponent ? <SubViewComponent setView={setSubView} /> : 
            <div className="flex-1 outline-none grid-cols-1 animate-in fade-in slide-in-from-top-8 duration-900">
                {loading ? (
                    <div className="grid grid-cols-1 flex align-center justify-center">
                        <div className="flex-1 outline-none grid-cols-1 flex align-center justify-center">
                            <div className="max-w-3/4 w-full">
                                <div className="flex items-center justify-between m-4">
                                    <Card className="w-32 animate-in fade-in slide-in-from-right-8 duration-300">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg">Usuarios</h2>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <p className="text-sm ">300</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-32 animate-in fade-in slide-in-from-right-8 duration-500">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg">Permisos</h2>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <p className="text-sm ">300</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-32 animate-in fade-in slide-in-from-right-8 duration-700">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg">Usuarios</h2>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <p className="text-sm ">300</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="w-32 animate-in fade-in slide-in-from-right-8 duration-900">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg">Usuarios</h2>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <p className="text-sm ">300</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="m-4">
                                    <Card className="w-full animate-in fade-in slide-in-from-bottom duration-900">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg">Usuarios</h2>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <p className="text-sm ">300</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="max-w-1/3 w-full">
                                <Card className="w-full">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <h2 className="font-bold">Mi Empresa</h2>
                                                <Button variant="outline" size="icon" className="ml-auto">
                                                    <RiQrCodeFill className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <CardDescription>
                                                Aquí puedes gestionar la información de tu empresa.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Form {...form}>
                                                <form>
                                                    <div className="grid gap-6">
                                                        <FormField
                                                            control={form.control}
                                                            name="marketing_emails"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center space-x-2">
                                                                    <FormLabel>Recibir correos de marketing</FormLabel>
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
                                                                <FormItem className="flex items-center space-x-2">
                                                                    <FormLabel>Recibir correos de seguridad</FormLabel>
                                                                    <FormControl>
                                                                        <Switch
                                                                            checked={field.value}
                                                                            onCheckedChange={field.onChange}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </form>
                                                <div className="mt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setSubView("permisos")}
                                                    >
                                                        Gestionar permisos de la empresa
                                                    </Button>
                                                </div>
                                            </Form>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button>
                                                Guardar Cambios
                                            </Button>
                                        </CardFooter>
                                    </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                <div className="col-span-2 max-sm:col-span-3 justify-between p-4">
                    <Loading />
                </div>
                )}
            </div>
        }
        </>
    );
}