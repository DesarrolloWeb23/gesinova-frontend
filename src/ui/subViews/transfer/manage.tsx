import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/ui/components/ui/card";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Button } from "@/ui/components/ui/button";
import LogoBox  from "@/ui/components/LogoBox";
import { Badge } from "@/ui/components/ui/badge";
import { Bell } from "lucide-react";
import { Tag } from "lucide-react";
import { BsBackpack2Fill } from "react-icons/bs";
import CustomLoader from "@/ui/components/CustomLoader";
import { HiMiniBellAlert } from "react-icons/hi2";
import { FaUserCheck, FaArrowsRotate, FaUserSlash } from "react-icons/fa6";
import { Dialog, DialogContent, DialogFooter, DialogHeader, 
    DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/ui/components/ui/dialog";
import { toast } from 'sonner';
import { TransferService } from '@/core/infrastructure/api/services/TransferService';
import { getMessage } from '@/core/domain/messages';
import { Turn } from '@/core/domain/models/Turn';
import { AdvanceTurnState } from '@/core/domain/use-cases/AdvanceTurnState';
import { CancelTurn } from '@/core/domain/use-cases/CancelTurn';
import { Turns } from '@/core/domain/models/Turns';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/components/ui/select';
import { AttentionService } from '@/core/domain/models/AttentionServices';
import { GetAttentionServices } from '@/core/domain/use-cases/GetAttentionServices';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TransferTurn } from '@/core/domain/use-cases/TransferTurn';
import Trigger from './trigger';
import Loading from '@/ui/components/Loading';
import { AlertDialog, AlertDialogAction, 
    AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, 
    AlertDialogTrigger } from '@/ui/components/ui/alert-dialog';
import { GetTurns } from '@/core/domain/use-cases/GetTurns';
import TableTurns from '@/ui/components/TableTurns';
import {
    ColumnDef,
} from "@tanstack/react-table"

const formSchema = z.object({
    attentionService: z.string().min(1).max(100)
});
export const columnsTurns = (handleSelectTurn: (turn: Turns) => void, selectedTurn: Turns | null): ColumnDef<Turns>[] => [
    {
        accessorKey: "turnCode",
        header: "Turno",
        cell: ({ row }) => <div >{row.getValue("turnCode")}</div>,
    },
    {
        accessorFn: (row) => row.firstName + " " + row.lastName, 
        id: "name",
        header: "Nombre",
        cell: ({ row }) => <div>{row.original.firstName + " " + row.original.lastName}</div>,
    },
    {
        accessorFn: (row) => row.state?.label, 
        id: "state",
        header: "Estado",
        cell: ({ row }) => <div>{row.original.state?.label}</div>,
    },
    {
        accessorFn: (row) => {
            const text = row.classificationAttention.attentionType.description;
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
        id: "attentionType",
        header: "Prioridad",
        cell: ({ row }) => <div className="lowercase">
                {row.original.classificationAttention.attentionType.description}
                    {row.original.classificationAttention.attentionType.description?.toUpperCase() === "PREFERENCIAL" && (
                    <span className="text-yellow-500"> ⭐</span>
                )}
            </div>,
    },
    {
        accessorFn: (row) => row.attentionService.module.name,
        id: "module",
        header: "Modulo",
        cell: ({ row }) => <div className="uppercase">
                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 px-4 py-1 rounded-full">
                    {row.original.attentionService.module.name}
                </Badge>
            </div>,
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Acciones",
        cell: ({ row }) => {
            const turn = row.original
            return (
                <Button   className={`${
                        turn.state.code !== 1 || (selectedTurn && selectedTurn.state.code !== 1)
                        ? 'hidden'
                        : ''
                    }`} onClick={() => handleSelectTurn(turn)} variant="outline">
                    <BsBackpack2Fill />
                    Seleccionar
                </Button>
            )
        }
    }
]


export default function Manage(){
    const [turns, setTurns] = useState<Turns[]>([]);
    const [selectedTurn, setSelectedTurn] = useState<Turns | null>(null);
    const [turnsPending, setTurnsPending] = useState<Turn[]>([]);
    const [turnsCompleted, setTurnsCompleted] = useState<string>("0");
    const [turnsCancelled, setTurnsCancelled] = useState<string>("0");
    const [attentionServices, setAttentionServices] = useState<AttentionService[]>([]);
    const closeRef = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const didFetch = useRef(false);
    const [isAnnouncing, setIsAnnouncing] = useState(false);
    const [motivo, setMotivo] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attentionService: ""
        }
    });

    // //funcion para obtener los turnos
    async function fetchTurns() {
        setIsLoading(true);
        const getTurnsUseCase = new GetTurns(new TransferService());
        try {
            await toast.promise( 
                getTurnsUseCase.execute()
                .then((response) => {
                    //valida los turnos y los filtra para mostrar solo los que no han sigo gestionados
                    const filteredTurns = response.filter(turn => turn.state.code !== 5 && turn.state.code !== 4);
                    //asigna los turnos a los estados correspondientes
                    const { pending } = splitTurns(response);
                    setTurnsPending(pending);
                    setTurns(filteredTurns);
                    setIsLoading(false);
                })
                .catch ((error) => {
                    setIsLoading(false);
                    console.error(error.details);
                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setIsLoading(false);
            console.error("Error al consultar el afiliado:", error);
        }
    }

    //funcion para avanzar el estado del turno
    async function handleAdvanceTurnState(turn: Turns) {
        const advanceTurnStateUseCase = new AdvanceTurnState(new TransferService());
        try {
            await toast.promise(
                advanceTurnStateUseCase.execute(turn.id)
                    .then((response) => {
                        // Actualizar SOLO el turno que cambió
                        setTurns((prevTurns) => 
                            prevTurns.map((turn) =>
                                turn.id === response.id
                                    ? { ...turn, ...response } // fusiona el turno previo con la nueva info
                                    : turn
                            )
                        );
                        //llama a la funcion para anunciar el turno
                        if(response.state.code === 2){
                            announceTurn(response);
                        }
                        //valida si el estado del turno es finalizado
                        if (response.state.code === 4) {
                            setTurnsCompleted(prev => (parseInt(prev) + 1).toString());
                            sessionStorage.setItem("turnCompleted", (parseInt(sessionStorage.getItem("turnCompleted") || "0") + 1).toString());
                            //eliminar el selectedTurn de la lista de turnos
                            setTurns(prev => prev.filter(turn => turn.id !== selectedTurn!.id));
                            handleClearSelectedTurn();
                        }else{
                            turn.state = response.state;
                            handleSelectTurn(turn);
                        }
                    })
                    .catch((error) => {
                        throw error;
                    }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) =>
                        error?.message
                }
            );
        } catch (error) {
            console.error("Error al avanzar el estado del turno:", error);
        }
    }

    //funcion para consultar los servicios de atencion
    async function handleGetAttentionServices() {
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

    //funcion para cancelar turno
    async function handleCancelTurn(turnId: string, motivo: string) {
        const cancelTurnUseCase = new CancelTurn(new TransferService());
        try {
            await toast.promise(
                cancelTurnUseCase.execute(turnId, motivo)
                    .then((response) => {
                        if (response) {
                            //eliminar el selectedTurn de la lista de turnos
                            setTurns(prev => prev.filter(turn => turn.id !== selectedTurn!.id));
                            handleClearSelectedTurn();
                            //suma mas 1 a los turnos cancelados
                            setTurnsCancelled(prev => (parseInt(prev) + 1).toString());
                            sessionStorage.setItem("turnCancelled", (parseInt(sessionStorage.getItem("turnCancelled") || "0") + 1).toString());
                        }
                    })
                    .catch((error) => {
                        throw error;
                    }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) =>
                        error?.message
                }
            );
        } catch (error) {
            console.error("Error al cancelar el turno:", error);
        }
    }

    //funcion para transferir turno
    async function handleTransferTurn (data: z.infer<typeof formSchema>){
        const transferTurnUseCase = new TransferTurn(new TransferService());
        try {
            await toast.promise(
                transferTurnUseCase.execute(selectedTurn!.id, data.attentionService)
                    .then((response) => {
                        if(response){
                            setTurnsCompleted(prev => (parseInt(prev) + 1).toString());
                            sessionStorage.setItem("turnCompleted", (parseInt(sessionStorage.getItem("turnCompleted") || "0") + 1).toString());
                            handleClearSelectedTurn();
                            closeRef.current?.click();
                        }
                    })
                    .catch((error) => {
                        throw error;
                    }),
                {
                    success: "Turno transferido con éxito",
                    loading: getMessage("success", "loading"),
                    error: (error) =>
                        error?.message
                }
            );
        } catch (error) {
            console.error("Error al transferir el turno:", error);
        }
    }

    const announceTurn = (turn: Turn) => {
        if (isAnnouncing) return; // Evita múltiples anuncios simultáneos
        setIsAnnouncing(true);
        const messageCode = new SpeechSynthesisUtterance(`Turno número ${turn.turnCode}`);
        messageCode.lang = "es-ES"; // español (puedes probar con "es-CO")
        messageCode.rate = 0.8;     // velocidad (1 es normal, 0.8 más lento, 1.2 más rápido)
        messageCode.pitch = 1;      // tono
        //valida si el turno tiene nombre
        if(turn.firstName) {
            const messageName =  new SpeechSynthesisUtterance(`${turn.firstName + " " + turn.lastName}`);
            messageName.lang = "es-ES";
            messageName.rate = 0.8;       // velocidad (1 es normal, 0.8 más lento, 1.2 más rápido)
            messageName.pitch = 1;      // tono
            window.speechSynthesis.speak(messageCode);
            window.speechSynthesis.speak(messageName);
            messageName.onend = () => setIsAnnouncing(false);
        }else{
            const messageIdentification =  new SpeechSynthesisUtterance(`${turn.identificationNumber}`);
            messageIdentification.lang = "es-ES";
            messageIdentification.rate = 0.8;       // velocidad (1 es normal, 0.8 más lento, 1.2 más rápido)
            messageIdentification.pitch = 1;      // tono
            window.speechSynthesis.speak(messageCode);
            window.speechSynthesis.speak(messageIdentification);
            messageIdentification.onend = () => setIsAnnouncing(false);
        }
    };

    //funcion para seleccionar un turno
    const handleSelectTurn = useCallback((turn: Turn) => {
        //almacen el turno en local storage
        localStorage.setItem("selectedTurn", JSON.stringify(turn));
        setSelectedTurn(turn as Turns);
    }, []);

    //funcion para limpiar el turno seleccionado
    const handleClearSelectedTurn = () => {
        localStorage.removeItem("selectedTurn");
        setSelectedTurn(null);
    }

    //funcion para llamar al siguiente turno
    const handleCallTurn = () => {
        const turn: Turns | null = getLastTurn();
        if (!turn) {
            toast.error("No hay turnos disponibles para llamar");
            return;
        }
        handleAdvanceTurnState(turn!);
    }

    //funcion para dividir los turnos en diferentes estados
    function splitTurns(turns: Turn[]) {
        return {
            pending: turns.filter(t => t.state.code === 1),
            completed: turns.filter(t => t.state.code === 4),
            cancelled: turns.filter(t => t.state.code === 5),
        };
    }

    //funcion que toma los turnos y devuelve el ultimo turno 
    const getLastTurn = (): Turns | null => {
        if (turns.length === 0) return null;
        return turns[0];
    };

    useEffect(() => {
        if (didFetch.current) return;
        setIsLoading(true);
        const getTurnsUseCase = new GetTurns(new TransferService());
        try {
            toast.promise( 
                getTurnsUseCase.execute()
                .then((response) => {
                    //valida los turnos y los filtra para mostrar solo los que no han sigo gestionados
                    const filteredTurns = response.filter(turn => turn.state.code !== 5 && turn.state.code !== 4);
                    //asigna los turnos a los estados correspondientes
                    const { pending } = splitTurns(response);
                    setTurnsPending(pending);
                    setTurns(filteredTurns);
                    setIsLoading(false);
                    didFetch.current = true;
                })
                .catch ((error) => {
                    setIsLoading(false);
                    console.error(error.details);
                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setIsLoading(false);
            console.error("Error al consultar el afiliado:", error);
        }
        setTurnsCancelled(sessionStorage.getItem("turnCancelled") || "0");
        setTurnsCompleted(sessionStorage.getItem("turnCompleted") || "0");
        //valida si hay un turno cargado en local storage y si lo hay lo carga al selectedturn
        const storedTurn = localStorage.getItem("selectedTurn");
        if (storedTurn) {
            setSelectedTurn(JSON.parse(storedTurn));
        }
        const interval = setInterval(() => fetchTurns(), 10000); // cada 10 segundos
        return () => clearInterval(interval); // limpiar al desmontar
    }, 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-top-8 duration-400 w-full lg:max-w-1/3 m-2">
                <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid gap-2 flex items-center justify-center">
                                <div className="flex items-center justify-center rounded-lg relative gap-2">
                                    {/** boton en la parte superior derecha para ver detalles del turno */}
                                    <div className="animate-in fade-in slide-in-from-top-8 duration-900 border border-gray-300 p-4 flex items-center justify-center rounded-lg  h-60 w-70 bg-input dark:bg-input/30 relative">
                                    {selectedTurn && (
                                        <div className={` ${selectedTurn.state?.code !== 1 ? 'hidden' : ''} absolute top-2 right-4 cursor-pointer`} onClick={() => handleClearSelectedTurn()}>
                                            x
                                        </div>
                                    )}
                                        {selectedTurn ?  <LogoBox turno={selectedTurn.turnCode} /> : <CustomLoader />}
                                    </div>
                                </div>
                                <div className={`${selectedTurn ? '' : 'hidden'} flex items-center justify-center rounded-lg relative gap-2`}>
                                    <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 px-4 py-1 rounded-full">
                                        <Tag className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="font-semibold">Servicio:</span> {selectedTurn ? selectedTurn.attentionService?.name : "Sin servicio registrado"}
                                    </Badge>
                                    <Badge variant="outline" className="text-cyan-600 border-cyan-300 bg-cyan-50 px-4 py-1 rounded-full">
                                        <Tag className="w-4 h-4 mr-2 text-cyan-600" />
                                        <span className="font-semibold">Prioridad:</span> {selectedTurn ? selectedTurn.classificationAttention?.attentionType?.description : "Sin prioridad"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className='grid grid-cols-2 gap-2'>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">Tipo de documento</Label>
                                        <Input id="tabs-demo-new" placeholder="Tipo documento" defaultValue={selectedTurn?.identificationType} readOnly/>
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor="tabs-demo-new">Número de Documento</Label>
                                        <Input id="tabs-demo-new" placeholder="Numero" defaultValue={selectedTurn?.identificationNumber} readOnly/>
                                    </div>
                                </div>
                                <Label htmlFor="tabs-demo-new">Nombre</Label>
                                <Input id="tabs-demo-new" placeholder="Nombre" defaultValue={
                                    selectedTurn ? selectedTurn.firstName + " " + selectedTurn.lastName : ""
                                } readOnly/>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-1 gap-2">
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => handleAdvanceTurnState(selectedTurn!)} disabled={!selectedTurn || selectedTurn.state?.code === 3 || isAnnouncing ? true : false} variant={'tertiary'}><HiMiniBellAlert />
                            {selectedTurn && selectedTurn.state?.code === 2 ? 'Atender' : 'Llamar'}
                            </Button>
                            <Button onClick={() => handleAdvanceTurnState(selectedTurn!)} disabled={selectedTurn && selectedTurn.state?.code === 3 ? false : true}><FaUserCheck />Finalizar</Button>
                        </div>
                        <div className="flex justify-center gap-4" >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                    onClick={() => handleGetAttentionServices()} 
                                    className={selectedTurn ? '' : 'hidden'}
                                    >
                                    <FaArrowsRotate /> Tranferir
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[425px]">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleTransferTurn)}>
                                            <DialogHeader>
                                            <DialogTitle>Transferir Turno</DialogTitle>
                                            <DialogDescription>
                                                Seleccione el servicio al cual desea transferir el turno.
                                            </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid gap-4 py-4">
                                                <FormField
                                                control={form.control}
                                                name="attentionService"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel htmlFor="tabs-demo-current">Servicio:</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione servicio" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                            {attentionServices?.map(service => (
                                                                <SelectItem key={service.id} value={service.id.toString()}>
                                                                {service.name}
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

                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button ref={closeRef} variant="outline">
                                                    Cancelar
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit">Guardar cambios</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <div>
                                    <Button className={`${selectedTurn ? "" : "hidden"}`} variant="destructive">
                                        <FaUserSlash />Cancelar
                                    </Button>
                                    </div>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Para cancelar el turno seleccionado debes confirmar el motivo.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Motivo de cancelación</label>
                                        <Select onValueChange={setMotivo}>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un motivo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="abandono">Cancelado por abandono</SelectItem>
                                            <SelectItem value="fuera_horario">Turno fuera del horario laboral</SelectItem>
                                            <SelectItem value="expirado">Expiró el tiempo de atención</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setMotivo("")}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={!motivo}
                                        onClick={() => handleCancelTurn(selectedTurn!.id.toString(), motivo)}
                                        className=""
                                    >
                                        Continuar
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={() => announceTurn(selectedTurn!)} disabled={!selectedTurn || selectedTurn.state?.code !== 2 ? true : false} variant={'tertiary'}><HiMiniBellAlert />
                                {isAnnouncing === true ? 'Llamando...' : 'Rellamar'}
                            </Button>
                        </div> 
                    </CardFooter>
                </Card>
            </div>
            <div  className="animate-in fade-in slide-in-from-top-8 duration-400 w-full lg:max-w-3/4 m-2">
                <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent className="grid gap-6">
                        <div className="text-center font-bold text-foreground">
                            DATOS DEL LLAMADO
                        </div>
                        <div className="flex justify-center gap-4">
                            <Badge variant="outline" className="text-blue-600 bg-blue-100 border-blue-300">
                                <Bell className="w-4 h-4 mr-1 text-blue-600" />
                                Pendientes: {turnsPending.length}
                            </Badge>

                            <Badge variant="outline" className="text-red-600 bg-red-100 border-red-300">
                                <Bell className="w-4 h-4 mr-1 text-red-600" />
                                Cancelados: {turnsCancelled}
                            </Badge>

                            <Badge variant="outline" className="text-blue-600 bg-blue-100 border-blue-300">
                                <Bell className="w-4 h-4 mr-1 text-blue-600" />
                                Finalizados: {turnsCompleted}
                            </Badge>
                        </div>
                        {isLoading ? (
                            <Loading />
                        ): 
                            <TableTurns handleTurnSelect={handleSelectTurn} turnsReceived={turns} columnsTurnsReceived={columnsTurns(handleSelectTurn, selectedTurn)} />

                        }
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button className={`${selectedTurn ? '' : 'hidden'}`}><BsBackpack2Fill />Ver turno</Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[800px] rounded-2xl bg-white/90 text-gray-900 shadow-xl backdrop-blur-md">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="font-bold text-center text-gray-800">
                                Información del turno
                                </DialogTitle>
                                <p className="text-center text-gray-500">
                                Turno <span className="font-semibold">{selectedTurn?.turnCode}</span>
                                </p>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                <Label className="text-gray-600">Identificación</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={
                                    selectedTurn?.identificationType +
                                    " " +
                                    selectedTurn?.identificationNumber
                                    }
                                    readOnly
                                />
                                </div>

                                <div className="space-y-1">
                                <Label className="text-gray-600">Estado</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={selectedTurn?.state.label}
                                    readOnly
                                />
                                </div>

                                <div className="space-y-1">
                                <Label className="text-gray-600">Nombre</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={selectedTurn?.firstName + " " + selectedTurn?.lastName}
                                    readOnly
                                />
                                </div>

                                <div className="space-y-1">
                                <Label className="text-gray-600">Sede</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={selectedTurn?.headQuarter}
                                    readOnly
                                />
                                </div>

                                <div className="space-y-1">
                                <Label className="text-gray-600">Servicio</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={selectedTurn?.attentionService.name}
                                    readOnly
                                />
                                </div>

                                <div className="space-y-1">
                                <Label className="text-gray-600">Clasificación</Label>
                                <Input
                                    className="rounded-lg border-gray-300 bg-gray-100"
                                    value={selectedTurn?.classificationAttention.description}
                                    readOnly
                                />
                                </div>
                            </div>
                            </DialogContent>
                        </form>
                        </Dialog>
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button><BsBackpack2Fill />Generar turno</Button>
                                </DialogTrigger>
                                <DialogContent className="grid grid-cols-1 bg-black/50 backdrop-blur-sm flex flex-wrap md:flex-nowrap align-center justify-center sm:max-w-[1200px]">
                                    <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    </DialogHeader>
                                <Trigger />
                                </DialogContent>
                            </form>
                        </Dialog>
                        <Button disabled={selectedTurn ? true : false} onClick={() => {handleCallTurn()}}><BsBackpack2Fill />Llamar turno</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}