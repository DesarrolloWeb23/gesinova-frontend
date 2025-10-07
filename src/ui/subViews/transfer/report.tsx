import { getMessage } from "@/core/domain/messages";
import { Turn } from "@/core/domain/models/Turn";
import { Turns } from "@/core/domain/models/Turns";
import { GetTurns } from "@/core/domain/use-cases/GetTurns";
import { TransferService } from "@/core/infrastructure/api/services/TransferService";
import Loading from "@/ui/components/Loading";
import TableTurns from "@/ui/components/TableTurns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/ui/components/ui/checkbox";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/ui/components/ui/dropdown-menu";
import { Button } from "@/ui/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const columnsTurns = (handleTurnSelect: (turn: Turns) => void): ColumnDef<Turns>[] => [
    {
        id: "select",
        header: ({ table }) => (
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
        ),
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "turnCode",
        header: "Turno",
        cell: ({ row }) => <div className="uppercase">{row.getValue("turnCode")}</div>,
    },
    {
        accessorKey: "firstName",
        header: "Nombre",
        cell: ({ row }) => <div className="uppercase">{row.getValue("firstName")}</div>,
    },
    {
        accessorKey: "lastName",
        header: "Apellido",
        cell: ({ row }) => <div className="uppercase">{row.getValue("lastName")}</div>,
    },
    {
        accessorFn: (row) => row.attentionService?.name, 
        id: "attentionService",
        header: "Servicio",
        cell: ({ row }) => <div className="uppercase">{row.original.attentionService?.name}</div>,
    },
    {
        accessorFn: (row) => row.classificationAttention?.description, 
        id: "classificationAttention",
        header: "Clasificación",
        cell: ({ row }) => <div className="uppercase">{row.original.classificationAttention?.description}</div>,
    },
    {
        accessorFn: (row) => row.state?.label, 
        id: "state",
        header: "Estado",
        cell: ({ row }) => <div className="uppercase">{row.original.state?.label}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
        const turnSelected = row.original

        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem
                    onClick={() =>  handleTurnSelect(turnSelected)}
                    >Gestionar permisos
                    </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )
        },
    },
]

export default function Report(){
    const [turn, setTurn] = useState<Turn | null>(null);
    const [turns, setTurns] = useState<Turns[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    //funcion al momento de seleccionar un turno
    const handleTurnSelect = (selectedTurn: Turn) => {
        setTurn(selectedTurn);
        console.log("Turno seleccionado:", turn);
    }

    useEffect(() => {
        setIsLoading(true);
        const getTurnsUseCase = new GetTurns(new TransferService());
        try {
            toast.promise( 
                getTurnsUseCase.execute()
                .then((response) => {
                    setTurns(response)
                    setIsLoading(false);
                })
                .catch ((error) => {
                    if (error?.status === 'ACCESS_DENIED') {
                        setAccessDenied(true);
                        return;
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
            console.error("Error al consultar el afiliado:", error);
        }
    }, []); 

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
                <p className="mt-2 text-muted-foreground">
                    No tienes permisos para acceder a esta sección.
                </p>
                <Button className="mt-4">Volver</Button>
            </div>
        );
    }

    return (
        <>   
            {isLoading ? (
                <Loading />
            ): (
                <TableTurns handleTurnSelect={handleTurnSelect} turnsReceived={turns} columnsTurnsReceived={columnsTurns(handleTurnSelect)}/>
            )}
        </>
    );
} 