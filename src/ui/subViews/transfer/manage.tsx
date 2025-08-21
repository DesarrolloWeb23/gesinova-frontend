import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/ui/components/ui/card";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Button } from "@/ui/components/ui/button";
import LogoBox  from "@/ui/components/LogoBox";
import { Badge } from "@/ui/components/ui/badge";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Tag } from "lucide-react";
import { BsBackpack2Fill } from "react-icons/bs";
import CustomLoader from "@/ui/components/CustomLoader";
import { HiMiniBellAlert } from "react-icons/hi2";
import { FaUserCheck, FaArrowsRotate, FaUserSlash } from "react-icons/fa6";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/ui/components/ui/dialog";

export default function Manage(){
    const [isValid, setIsValid] = useState(false);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 w-full sm:max-w-9/10 m-1">
                <Card className="w-full">
                    <CardContent className="">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid gap-2 flex items-center justify-center">
                                <div className="animate-in fade-in slide-in-from-top-8 duration-900 border border-gray-300 p-4 flex items-center justify-center rounded-lg  h-60 w-70 bg-gray-100">
                                    {isValid ?  <LogoBox turno="A3" /> : <CustomLoader />}
                                </div>
                                <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 px-4 py-1 rounded-full">
                                    <Tag className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="font-semibold">Servicio:</span> CONSULTA - LLAMADO # 0 DE 2
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">Tipo de documento</Label>
                                        <Input id="tabs-demo-new" placeholder="Tipo documento" />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">N° Documento</Label>
                                        <Input id="tabs-demo-new" placeholder="Numero" />
                                    </div>
                                </div>
                                <Label htmlFor="tabs-demo-new">Nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Nombre" />
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">Numero</Label>
                                        <Input id="tabs-demo-new" placeholder="Numero" />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">Edad</Label>
                                        <Input id="tabs-demo-new" placeholder="Edad" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-1 gap-2">
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setIsValid(!isValid)} disabled={isValid} variant={'tertiary'}><HiMiniBellAlert />Llamar</Button>
                            <Button onClick={() => setIsValid(!isValid)} disabled={!isValid} className='bg-green-500'><FaUserCheck />Finalizar</Button>
                        </div>
                        <div className="flex justify-center gap-4" >
                            <Button className={`${isValid ? '' : 'hidden'} bg-orange-500`} ><FaArrowsRotate />Tranferir</Button>
                            <Button className={`${isValid ? '' : 'hidden'}`}>Soltar</Button>
                            <Button className={`${isValid ? '' : 'hidden'}`} variant={'destructive'}><FaUserSlash />Cancelar</Button>
                        </div> 
                    </CardFooter>
                </Card>
            </div>
            <div  className="animate-in fade-in slide-in-from-top-8 duration-400 max-w-1/2 w-full m-1 hidden md:block">
                <Card className="w-full">
                    <CardContent className="grid gap-6">
                        <div className="text-center text-2xl font-bold">
                            Datos del llamado
                        </div>
                        <div className="flex justify-center gap-4">
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                                <Bell className="w-4 h-4 mr-1 text-blue-600" />
                                Activos: 4
                            </Badge>

                            <Badge variant="outline" className="text-red-600 bg-red-100 border-red-300">
                                <Bell className="w-4 h-4 mr-1 text-red-600" />
                                Atendidos: 2
                            </Badge>

                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                                <Bell className="w-4 h-4 mr-1 text-blue-600" />
                                Total: 6
                            </Badge>
                        </div>
                        <div className="border border-gray-300 p-4 rounded-lg">
                            <div className="flex items-center justify-center h-32 w-32 bg-gray-300 rounded-full mx-auto shadow-lg">
                                <Image
                                    src="/Logo_Gesinova.jpg"
                                    alt="Logo Gesinova"
                                    width={800}
                                    height={800}
                                    className="rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button><BsBackpack2Fill />Ver turno</Button>
                            <Dialog>
                                <form>
                                    <DialogTrigger asChild>
                                    <Button variant="outline">Open Dialog</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                        Make changes to your profile here. Click save when you&apos;re
                                        done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4">
                                        <div className="grid gap-3">
                                        <Label htmlFor="name-1">Name</Label>
                                        <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                                        </div>
                                        <div className="grid gap-3">
                                        <Label htmlFor="username-1">Username</Label>
                                        <Input id="username-1" name="username" defaultValue="@peduarte" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        <Button><BsBackpack2Fill />Generar turno</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}