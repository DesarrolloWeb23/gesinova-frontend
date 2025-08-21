import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/ui/components/ui/card";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger,
    SelectValue } from "@/ui/components/ui/select";
import { TbArrowBackUp } from 'react-icons/tb';
import { BsBackpack2Fill } from 'react-icons/bs';
import { z } from "zod";
import { getMessage } from "@/core/domain/messages";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/components/ui/form';
import { toast } from 'sonner';
import { GetAffiliateByDni } from '@/core/domain/use-cases/GetAffiliateByDni';
import { AffiliateApiService } from '@/core/infrastructure/api/services/AffiliateService';
import { Affiliate } from '@/core/domain/models/Affiliate';
import { GenerateAppointment } from '@/core/domain/use-cases/GenerateAppointment';
import { TransferService } from '@/core/infrastructure/api/services/TransferService';
import { Turn } from '@/core/domain/models/Turn';
import { GetAttentionServices } from '@/core/domain/use-cases/GetAttentionServices';
import { AttentionService } from '@/core/domain/models/AttentionServices';

const formSchema = z.object({
    identificationType: z.string()
    .min(2, getMessage("errors", "zod_username_required")),
    numberIdentification: z.string().min(4, getMessage("errors", "zod_password_required")),
    priority: z.string().min(1, getMessage("errors", "zod_priority_required"))
})

export default function Trigger() {
    const [isValid, setIsValid] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [affiliate, setAffiliate] = useState<Affiliate>({} as Affiliate);
    const [priority, setPriority] = useState<string>("");
    const [turn, setTurn] = useState<Turn>({} as Turn);
    const [showModal, setShowModal] = useState(false);
    const [attentionServices, setAttentionServices] = useState<AttentionService[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            identificationType: "",
            numberIdentification: "",
            priority: ""
        }, 
    })

    //funcion para consultar el afiliado por tipo de documento y numero
    const handleGetAffiliate = async (data: z.infer<typeof formSchema>) => {
        const affiliateUsesCase = new GetAffiliateByDni(new AffiliateApiService());
        try {
            await toast.promise( 
                affiliateUsesCase.execute(data.identificationType, data.numberIdentification)
                .then((response) => {
                    setAffiliate(response);
                    setIsValid(true);
                    setPriority(data.priority);
                })
                .catch ((error) => {
                    setIsValid(false);
                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setIsValid(false);
            console.error("Error al consultar el afiliado:", error);
        }
    }

    //funcion para volver atras y limpiar los datos del afiliado para reiniciar el formulario
    const handleReset = () => {
        setIsValid(false);
        setAffiliate({} as Affiliate);
        setShowModal(false)
        form.reset({
            identificationType: "",
            numberIdentification: "",
            priority: ""
        });
    }

    //funcion para consultar los servicios de atencion
    const handleGetAttentionServices = async () => {
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

    //funcion para generar turno
    const handleGenerateAppointment = async ( dattentionService: number ) => {
        if (!isValid || !affiliate) return;

        const generateAppointmentUseCase = new GenerateAppointment(new TransferService());
        //convertir priority a number
        const priorityNumber = Number(priority);
        try {
            await toast.promise(
                generateAppointmentUseCase.execute(affiliate, dattentionService, priorityNumber)
                .then((response) => {
                    setTurn(response.data);
                    setShowModal(true);
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
            console.error("Error al generar el turno:", error);
        }
    }

    useEffect(() => {
        handleGetAttentionServices();
    }, []);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 w-full lg:max-w-1/3 m-2">
                <Card className="w-full">
                    <CardContent >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleGetAffiliate)} className="grid gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="identificationType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Documento</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Seleccione Tipo documento" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                <SelectItem value="CC">Cedula</SelectItem>
                                                                <SelectItem value="TI">Tarjeta de identidad</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="numberIdentification"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>N° Documento</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Numero" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-3 items-center justify-center text-center">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="priority"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="tabs-demo-current">Prioridad</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Seleccione prioridad" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                <SelectItem value="23">Prioritario</SelectItem>
                                                                <SelectItem value="2">Embarazadas</SelectItem>
                                                                <SelectItem value="3">No aplica</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-end gap-2'>
                                    <Button type="submit"  disabled={isValid}>Validar</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button className={`${isValid ? '' : 'hidden'}`} variant={"ghost"} size={"icon"} onClick={handleReset}><TbArrowBackUp /></Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="tertiary">Actualizar datos</Button>
                    </CardFooter>
                </Card>
            </div>
            <div  className={`animate-in fade-in slide-in-from-top-8 duration-900 w-full lg:max-w-3/4 m-2 ${isValid ? '' : 'hidden'}`}>
                <Card className="w-full">
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Primer nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Primer nombre" defaultValue={affiliate.firstName} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Segundo nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Segundo nombre" defaultValue={affiliate.middleName} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Primer apellido</Label>
                                <Input id="tabs-demo-new" placeholder="Primer apellido" defaultValue={affiliate.firstLastName} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Segundo apellido</Label>
                                <Input id="tabs-demo-new" placeholder="Segundo apellido" defaultValue={affiliate.secondLastName} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Genero</Label>
                                <Input id="tabs-demo-new" placeholder="Genero"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Celular</Label>
                                <Input id="tabs-demo-new" placeholder="Celular" defaultValue={affiliate.phone} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Correo</Label>
                                <Input id="tabs-demo-new" placeholder="Correo" defaultValue={affiliate.email} />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-3 gap-3 items-center justify-center text-center ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Fecha nacimiento</Label>
                                <Input id="tabs-demo-new" placeholder="Fecha de nacimiento"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Fecha expedicion documento</Label>
                                <Input id="tabs-demo-new" placeholder="Fecha de expedicion"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Nacionalidad</Label>
                                <Input id="tabs-demo-new" placeholder="Nacionalidad"/>
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Departamento</Label>
                                <Input id="tabs-demo-new" placeholder="Departamento" defaultValue={affiliate.department} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Ciudad</Label>
                                <Input id="tabs-demo-new" placeholder="Ciudad" defaultValue={affiliate.municipality} />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Direccion de residencia</Label>
                                <Input id="tabs-demo-new" placeholder="Direccion de residencia"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Discapacidad</Label>
                                <Input id="tabs-demo-new" placeholder="Discapacidad"/>
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Comunidad indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Comunidad indigena"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Grupo etnico</Label>
                                <Input id="tabs-demo-new" placeholder="Grupo etnico"/>
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Organizacion indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Organizacion indigena"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Reguardo indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Resguardo indigena"/>
                            </div>
                        </div>
                        <div  className={`grid grid-cols-3 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Codigo localidad</Label>
                                <Input id="tabs-demo-new" placeholder="Codigo localidad"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Grupo sisben</Label>
                                <Input id="tabs-demo-new" placeholder="Grupo sisben"/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Nivel sisben</Label>
                                <Input id="tabs-demo-new" placeholder="Nivel sisben"/>
                            </div>
                        </div>
                        <p onClick={() => setIsActive(!isActive)} className="text-blue-500 cursor-pointer text-sm w-1/6">
                            {isActive ? "Ver más" : "Ver menos"}
                        </p>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {/*recorree los servicios de atencion y crea un boton con cada uno*/}
                        {attentionServices.map(service => (
                            <Button key={service.id} className={`${isValid ? '' : 'hidden'} text-black text-sm `} onClick={() => handleGenerateAppointment(service.id)} variant="secondary">
                                <BsBackpack2Fill />
                                {service.name}
                            </Button>
                        ))}
                    </CardFooter>
                </Card>
                {/* Modal */}
                {showModal && turn && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-primary rounded-xl p-6 shadow-lg w-96">
                            <h2 className="text-xl text-center font-semibold mb-4">Turno Asignado</h2>

                            <div className='mb-8 text-center underline underline-offset-4'>
                                <p><strong>Número de turno:</strong> {turn.turnCode}</p>
                            </div>
                            <p><strong>Cliente:</strong> {turn.firstName} {turn.lastName}</p>
                            <p><strong>Estado:</strong> {turn.state.label}</p>

                            <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => handleReset()}
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Cerrar
                            </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}