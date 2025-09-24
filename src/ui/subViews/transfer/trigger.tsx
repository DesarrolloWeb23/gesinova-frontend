import React, { useEffect, useRef, useState } from 'react';
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
import { GetClassificationAttention } from '@/core/domain/use-cases/GetClassificationAttention';
import { ClassificationAttention } from '@/core/domain/models/ClassificationAttention';
import Loading from '@/ui/components/Loading';
import { FaTicket } from "react-icons/fa6";

const formSchema = z.object({
    identificationType: z.string()
    .min(2, getMessage("errors", "zod_username_required")),
    numberIdentification: z.string().min(4, getMessage("errors", "zod_password_required")),
    priority: z.string().min(1, getMessage("errors", "zod_priority_required"))
})

const formSchemaNewUser = z.object({
    firstName: z.string().min(2, getMessage("errors", "zod_first_name_required")),
    middleName: z.string().min(2, getMessage("errors", "zod_last_name_required")).nullable(),
    firstLastName: z.string().min(2, getMessage("errors", "zod_first_last_name_required")),
    secondLastName: z.string().min(2, getMessage("errors", "zod_second_last_name_required")).nullable(),
    municipality: z.string().min(2, getMessage("errors", "zod_municipality_required")),
    department: z.string().min(2, getMessage("errors", "zod_department_required"))
})


export default function Trigger() {
    const [isValid, setIsValid] = useState(false);
    const [affiliate, setAffiliate] = useState<Affiliate>({} as Affiliate);
    const [priority, setPriority] = useState<string>("");
    const [turn, setTurn] = useState<Turn>({} as Turn);
    const [showModal, setShowModal] = useState(false);
    const [attentionServices, setAttentionServices] = useState<AttentionService[]>([]);
    const [classificationAttention, setClassificationAttention] = useState<ClassificationAttention[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const didFetch = useRef(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            identificationType: "",
            numberIdentification: "",
            priority: ""
        }, 
    })

    const formNewUser = useForm<z.infer<typeof formSchemaNewUser>>({
        resolver: zodResolver(formSchemaNewUser),
        defaultValues: {
            firstName: affiliate.firstName,
            middleName: affiliate.middleName,
            firstLastName: affiliate.firstLastName,
            secondLastName: affiliate.secondLastName,
            municipality: affiliate.municipality,
            department: affiliate.department
        }
    });

    //funcion para consultar el afiliado por tipo de documento y numero
    const handleGetAffiliate = async (data: z.infer<typeof formSchema>) => {
        const affiliateUsesCase = new GetAffiliateByDni(new AffiliateApiService());
        try {
            await toast.promise( 
                affiliateUsesCase.execute(data.identificationType, data.numberIdentification)
                .then((response) => {
                    setIsRegistering(false);
                    setAffiliate(response);
                    setIsValid(true);
                    setPriority(data.priority);
                })
                .catch ((error) => {
                    setIsValid(false);
                    if(error.status === 'NOT_FOUND'){
                        setIsRegistering(true);
                        setPriority(data.priority);
                    }
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
        setIsRegistering(false);
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
    

    //funcion auxiliar para generar turno
    const handleGenerateAppointment = async (dattentionService: number) => {
        if (!isValid) return;

        const priorityNumber = Number(priority);

        let affiliateData: Affiliate;

        if (isRegistering) {
            const valuesForm = form.getValues();
            
            if (!affiliate.firstName) {
                toast.error("El campo Primer nombre es obligatorio");
                return;
            }
            if (!affiliate.firstLastName) {
                toast.error("El campo Primer apellido es obligatorio");
                return;
            }

            //validar que los campos no contengan caracteres especiales ni numeros, ni espacios
            const nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(affiliate.firstName) || 
                !nameRegex.test(affiliate.middleName) || 
                !nameRegex.test(affiliate.firstLastName) || 
                !nameRegex.test(affiliate.secondLastName) ) {
                toast.error("Los nombres solo deben contener letras sin espacios ni caracteres especiales");
                return;
            }

            affiliateData = {
                firstName: affiliate.firstName,
                middleName: affiliate.middleName ? affiliate.middleName : "",
                firstLastName: affiliate.firstLastName,
                secondLastName: affiliate.secondLastName ? affiliate.secondLastName : "",
                email: '',
                phone: '',
                identificationNumber: valuesForm.numberIdentification,
                identificationType: valuesForm.identificationType,
                municipality: affiliate.municipality,
                department: affiliate.department,
            };

        } else {
            affiliateData = affiliate;
        }

        await executeGenerateAppointment(affiliateData, dattentionService, priorityNumber);
    };
    
    //funcion para obtener las clasificaciones de atencion
    const handleGetClassificationAttention = async () => {
        const classificationAttentionUseCase = new GetClassificationAttention(new TransferService());
        try {
            await toast.promise(
                classificationAttentionUseCase.execute()
                .then((response) => {
                    setClassificationAttention(response);
                    setLoading(false);
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
            console.error("Error al consultar las clasificaciones de atención:", error);
        }
    }

    //funcion para generar turno
    const executeGenerateAppointment = async (data: Affiliate, dattentionService: number, priorityNumber: number) => {
        const generateAppointmentUseCase = new GenerateAppointment(new TransferService());

        try {
            await toast.promise(
            generateAppointmentUseCase.execute(data, dattentionService, priorityNumber)
                .then((response) => {
                setTurn(response.data);
                setShowModal(true);
                }),
            {
                loading: getMessage("success", "loading"),
                error: (error) => error?.message,
            }
            );
        } catch (error) {
            console.error("Error al generar el turno:", error);
        }
    };

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        handleGetAttentionServices();
        handleGetClassificationAttention();
    }, []);

    if (loading) {
        return (
            <div className="col-span-2 max-sm:col-span-3 p-4 flex items-center justify-center flex h-full">
                <Loading />
            </div>
        );
    }

    //validacion si la peticion a la API no se completo
    if (!attentionServices.length || !classificationAttention.length) {
        return (
            <div className="col-span-2 max-sm:col-span-3 p-4 flex flex-col items-center justify-center gap-4 h-full">
                <div>No se pudieron cargar los datos</div>
                <div>
                    <Button
                    onClick={() => {
                        handleGetAttentionServices();
                        handleGetClassificationAttention();
                    }}
                    >
                    Reintentar
                    </Button>
                </div>
            </div>
        )
    }


    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 w-full lg:max-w-1/4 m-2">
                <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleGetAffiliate)} className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="identificationType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Documento</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione Tipo documento" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="CC">CEDULA DE CIUDADANIA</SelectItem>
                                                                    <SelectItem value="CD">CARNET DIPLOMATICO</SelectItem>
                                                                    <SelectItem value="CN">CERTIFICADO DE NACIDO VIVO - DANE</SelectItem>
                                                                    <SelectItem value="PA">PASAPORTE</SelectItem>
                                                                    <SelectItem value="SC">SALVO CONDUCTO</SelectItem>
                                                                    <SelectItem value="PE">PERMISO ESPECIAL DE PERMANENCIA</SelectItem>
                                                                    <SelectItem value="NU">NUMERO UNICO IDENTIFICACION</SelectItem>
                                                                    <SelectItem value="PT">PERMISO PROTECCION TEMPORAL</SelectItem>
                                                                    <SelectItem value="RC">REGISTRO CIVIL</SelectItem>
                                                                    <SelectItem value="TI">TARJETA DE IDENTIDAD</SelectItem>
                                                                    <SelectItem value="CE">CEDULA DE EXTRANJERIA</SelectItem>
                                                                    <SelectItem value="MS">MENOR SIN IDENTIFICACION</SelectItem>
                                                                    <SelectItem value="AS">ADULTO SIN IDENTIFICACION</SelectItem>
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
                                                                    {classificationAttention.map(classification => (
                                                                        <SelectItem key={classification.id} value={classification.id.toString()}>{classification.description}</SelectItem>
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
                                <div className='flex justify-end gap-2'>
                                    <Button className={`${isValid ? '' : 'hidden'}`} variant={"ghost"} size={"icon"} onClick={handleReset}><TbArrowBackUp /></Button>
                                    <Button type="submit"  disabled={isValid}>Validar</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button className={`${isRegistering ? '' : 'hidden'}`} onClick={() => {setIsRegistering(true); setIsValid(true)}} variant="tertiary">Registrar usuario</Button>
                    </CardFooter>
                </Card>
            </div>
            <div  className={`animate-in fade-in slide-in-from-top-8 duration-900 w-full lg:max-w-3/4 m-2 ${isValid ? '' : 'hidden'}`}>
                <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent className="grid gap-6">
                    {isRegistering ? (
                        <Form {...formNewUser}>
                            <form className="grid gap-6">
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={formNewUser.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Primer nombre</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                        placeholder="Primer nombre" {...field} defaultValue={affiliate.firstName ?? ""}
                                                        onChange={(e) => setAffiliate({ ...affiliate, firstName: e.target.value })}/>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={formNewUser.control}
                                            name="middleName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Segundo nombre</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Segundo nombre" {...field} value={affiliate.middleName ?? ""} 
                                                        onChange={(e) => setAffiliate({ ...affiliate, middleName: e.target.value })}/>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={formNewUser.control}
                                            name="firstLastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Primer apellido</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                        placeholder="Primer apellido" {...field} 
                                                        defaultValue={affiliate.firstLastName ?? ""}
                                                        onChange={(e) => setAffiliate({ ...affiliate, firstLastName: e.target.value })}/>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={formNewUser.control}
                                            name="secondLastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Segundo apellido</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Segundo apellido" {...field} value={affiliate.secondLastName ?? ""}
                                                        onChange={(e) => setAffiliate({ ...affiliate, secondLastName: e.target.value })}/>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <CardFooter className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                                    {attentionServices.map(service => (
                                        <Button type="button" key={service.id} className={`${isValid ? '' : 'hidden'} text-black h-20`} onClick={() => handleGenerateAppointment(service.id)}>
                                            <BsBackpack2Fill />
                                            {service.name}
                                        </Button>
                                    ))}
                                </CardFooter>
                            </form>
                        </Form>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Primer nombre</Label>
                                    <Input id="tabs-demo-new" placeholder="Primer nombre" value={affiliate.firstName + ' ' + affiliate.middleName + ' ' + affiliate.firstLastName + ' ' + affiliate.secondLastName || ""} readOnly/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Departamento</Label>
                                    <Input id="tabs-demo-new" placeholder="Departamento" value={affiliate.department || ""} readOnly/>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Ciudad</Label>
                                    <Input id="tabs-demo-new" placeholder="Ciudad" value={affiliate.municipality || ""} readOnly/>
                                </div>
                            </div>
                            <CardFooter className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                                {attentionServices.map(service => (
                                    <Button key={service.id} className={`${isValid ? '' : 'hidden'} text-black whitespace-normal break-words text-center sm:text-xl lg:text-xl h-20`} onClick={() => handleGenerateAppointment(service.id)}>
                                        <BsBackpack2Fill />
                                        {service.name}
                                    </Button>
                                ))}
                            </CardFooter>
                        </>
                    )}
                    </CardContent>
                </Card>
                {/* Modal */}
                {showModal && turn && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl w-96 border border-neutral-300">
                    
                    <h2 className="text-2xl font-semibold flex items-center justify-center text-center text-neutral-800 mb-6">
                        <FaTicket className='mr-2'/> Turno Asignado
                    </h2>

                    <div className="mb-6 text-center space-y-2">
                        <p className="text-lg font-medium text-neutral-700">
                        <span className="font-semibold text-neutral-900">Número:</span> {turn.turnCode}
                        </p>
                        <p className="text-neutral-700">
                        <span className="font-semibold">Afiliado:</span> {turn.firstName} {turn.lastName}
                        </p>
                        <p className="text-neutral-700">
                        <span className="font-semibold">Estado:</span> {turn.state.label}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Button
                        onClick={() => handleReset()}
                        variant={'destructive'}
                        >
                        Cerrar
                        </Button>
                    </div>
                    </div>
                </div>
                )}
            </div>
        </>
    );
}