import { getMessage } from '@/core/domain/messages';
import { AttentionService } from '@/core/domain/models/AttentionServices';
import { GetAttentionServices } from '@/core/domain/use-cases/GetAttentionServices';
import { TransferService } from '@/core/infrastructure/api/services/TransferService';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/components/ui/form';
import { Input } from "@/ui/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { decodeJwt, JwtPayload } from "@/lib/jwt";
import { AttentionModule } from '@/core/domain/models/AttentionModules';
import { GetAttentionModules } from '@/core/domain/use-cases/GetAttentionModules';
import Loading from '@/ui/components/Loading';

const formSchema = z.object({
    code: z.string().min(2, getMessage("errors", "zod_username_required")).max(3, getMessage("errors", "zod_username_too_long")),
    name: z.string().min(4, getMessage("errors", "zod_password_required")),
    module: z.string().min(1, getMessage("errors", "zod_priority_required"))
})

export default function CreateAttentionService() {
    const [attentionServices, setAttentionServices] = useState<AttentionService[]>([]);
    const [accessDenied, setAccessDenied] = useState(false);
    const [attentionModules, setAttentionModules] = useState<AttentionModule[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            code: "",
            name: "",
            module: ""
        }, 
    }) 

    //funcion para consultar los servicios de atencion
    const handleGetAttentionServices = async () => {
        setIsLoading(true);
        const attentionServiceUseCase = new GetAttentionServices(new TransferService());
        try {
            await toast.promise(
                attentionServiceUseCase.execute()
                .then((response) => {
                    setAttentionServices(response);
                })
                .catch((error) => {
                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => error?.message
                }
            );
        } catch (error) {
            console.error("Error al consultar los servicios de atención:", error);
        }
    }

    //funcion para consultar los modulos de atencion
    const handleGetAttentionModules = async () => {
        const attentionModuleUseCase = new GetAttentionModules(new TransferService());
        try {
            await toast.promise(
                attentionModuleUseCase.execute()
                .then((response) => {
                    setAttentionModules(response);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => error?.message
                }
            );
        } catch (error) {
            setIsLoading(false);
            console.error("Error al consultar los modulos de atención:", error);
        }
    }

    const validateUserPermissions = () => {
        setAccessDenied(false);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        let usertoken: JwtPayload | null;

        if (token) {
            usertoken = decodeJwt(token);
        } else {
            usertoken = null;
        }

        if (usertoken) {
            //recorre el usertoken.permissions  para validar si tiene permiso de super admin
            const hasSuperAdminPermission = usertoken.permissions.includes("SUPER_ADMIN");
            if (!hasSuperAdminPermission) {
                setAccessDenied(true);
            }
        }
    };

    useEffect(() => {
        validateUserPermissions();
        handleGetAttentionServices();
        handleGetAttentionModules();
    }, []);

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
                <p className="mt-2 text-muted-foreground">
                    No tienes permisos para acceder a esta sección.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="col-span-2 max-sm:col-span-3 p-4 flex items-center justify-center flex h-full">
                <Loading />
            </div>
        );
    }

    return (
        <>
            <div className="w-full m-4 rounded-lg text-center">
                <h1 className='mb-2'>Crear Servicio de Atención</h1>
                <Form {...form}>
                    <form>
                        <div className="flex-1 outline-none grid-cols-1 flex align-center justify-center gap-6 mb-4">
                            <div className="w-2/5">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Codigo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Codigo" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-3/5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="module"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seleccione modulo</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seleccione modulo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {attentionModules.map((module) => (
                                                                <SelectItem key={module.id} value={module.internalCode}>
                                                                    {module.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button>Crear</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="w-full m-2 flex align-center justify-center">
                <div className='w-80'>
                    <ul className="list-disc list-inside space-y-1 space-x-1">
                        {attentionServices.map(service => (
                            <li key={service.id} className="text-sm text-muted-foreground">
                                <Badge variant="secondary">{service.name}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}