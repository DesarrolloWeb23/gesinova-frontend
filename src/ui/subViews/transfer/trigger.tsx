import React, { useState } from 'react';
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

const formSchema = z.object({
    identificationType: z.string()
    .min(2, getMessage("errors", "zod_username_required")),
    numberIdentification: z.string().min(4, getMessage("errors", "zod_password_required")),
    priority: z.string().min(2, getMessage("errors", "zod_priority_required"))
})

export default function Trigger() {
    const [isValid, setIsValid] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [affiliate, setAffiliate] = useState<Affiliate>({} as Affiliate);

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
        form.reset({
            identificationType: "",
            numberIdentification: "",
            priority: ""
        });
    }

    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 max-w-1/3 w-full m-2">
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
                                                                <SelectItem value="apple">Prioritario</SelectItem>
                                                                <SelectItem value="banana">Embarazadas</SelectItem>
                                                                <SelectItem value="blueberry">No sé</SelectItem>
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
            <div  className={`max-w-3/4 w-full animate-in fade-in slide-in-from-top-8 duration-900 ${isValid ? '' : 'hidden'}`}>
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
                    <CardFooter className="grid grid-cols-4 gap-2">
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />Autorizaciones</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />Aseguramiento</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />SIAU</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />SIAU</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />SIAU</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />SIAU</Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="secondary"><BsBackpack2Fill />SIAU</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}