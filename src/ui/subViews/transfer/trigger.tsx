import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/ui/components/ui/card";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger,
    SelectValue } from "@/ui/components/ui/select";
import { TbArrowBackUp } from 'react-icons/tb';
import { BsBackpack2Fill } from 'react-icons/bs';

export default function Trigger() {
    const [isValid, setIsValid] = useState(false);
    const [isActive, setIsActive] = useState(true);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 max-w-1/3 w-full m-2">
                <Card className="w-full">
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-current">Tipo de documento</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Tipo documento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>No aplica</SelectLabel>
                                        <SelectItem value="apple">Cedula</SelectItem>
                                        <SelectItem value="banana">Tarjeta de identidad</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">N° Documento</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div className="grid gap-3 items-center justify-center text-center">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-current">Prioridad</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Seleccione la prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>No aplica</SelectLabel>
                                        <SelectItem value="apple">Prioritario</SelectItem>
                                        <SelectItem value="banana">Embarazadas</SelectItem>
                                        <SelectItem value="blueberry">No sé</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button className={`${isValid ? '' : 'hidden'}`} variant={"ghost"} size={"icon"} onClick={() => setIsValid(!isValid)}><TbArrowBackUp /></Button>
                        <Button className={`${isValid ? '' : 'hidden'}`} variant="tertiary">Actualizar datos</Button>
                        <Button onClick={() => setIsValid(!isValid)} disabled={isValid}>Validar</Button>
                    </CardFooter>
                </Card>
            </div>
            <div  className={`max-w-3/4 w-full animate-in fade-in slide-in-from-top-8 duration-900 ${isValid ? '' : 'hidden'}`}>
                <Card className="w-full">
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Primer nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Segundo nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Primer apellido</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Segundo apellido</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Genero</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Celular</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Correo</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-3 gap-3 items-center justify-center text-center ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Fecha nacimiento</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Fecha expedicion documento</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Nacionalidad</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Departamento</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Ciudad</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Direccion de residencia</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Discapacidad</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Comunidad indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Grupo etnico</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-2 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Organizacion indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Reguardo indigena</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                        </div>
                        <div  className={`grid grid-cols-3 gap-6 ${isActive ? 'hidden' : ''}`}>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Codigo localidad</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Grupo sisben</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="tabs-demo-new">Nivel sisben</Label>
                                <Input id="tabs-demo-new" placeholder="Numero" />
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