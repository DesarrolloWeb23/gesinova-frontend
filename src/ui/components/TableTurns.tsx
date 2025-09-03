"use client"
import * as React from "react"
import { Button } from "@/ui/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/components/ui/table"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { Checkbox } from "@/ui/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { getMessage } from "@/core/domain/messages";
import  Loading  from "@/ui/components/Loading"
import { GetTurnsByState } from "@/core/domain/use-cases/GetTurnsByState"
import { TransferService } from "@/core/infrastructure/api/services/TransferService"
import { GetTurns } from "@/core/domain/use-cases/GetTurns"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Turns } from "@/core/domain/models/Turns"

type Props = {
    handleTurnSelect: (turn: Turns) => void,
}

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

export default function TableTurns( { handleTurnSelect}: Props){
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [turns, setTurns] = useState<Turns[]>([]);

    const tableTurns = useReactTable({
        data: turns,
        columns: columnsTurns(handleTurnSelect),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    //funcion para obtener los turnos
    async function fetchTurns() {
        setIsLoading(true);
        const getTurnsUseCase = new GetTurns(new TransferService());
        try {
            await toast.promise( 
                getTurnsUseCase.execute()
                .then((response) => {
                    setTurns(response)
                    setIsLoading(false);
                })
                .catch ((error) => {
                    setIsLoading(false);
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

    //funcion para obtener los turnos por estado
    async function fetchTurnsByState(state: number) {
        setIsLoading(true);
        const getTurnsByStateUseCase = new GetTurnsByState(new TransferService());
        try {
            await toast.promise(
                getTurnsByStateUseCase.execute(state)
                    .then((response) => {
                        setTurns(response)
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        // Manejo específico de error de permisos
                        if (error?.status === 'ACCESS_DENIED') {
                            handleAccessDenied();
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
            setIsLoading(false);
            console.error("Error al consultar los turnos por estado:", error);
        }
    }

    //funcion para manejar el acceso denegado
    const handleAccessDenied = () => {
        setAccessDenied(true);
    }

    useEffect(() => {
        fetchTurns();
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
                <div className="max-sm:col-span-3 justify-between p-4">
                    <Loading />
                </div>
            ) : (
                <div className="w-full p-4">
                    <div className="flex items-center py-4 space-x-2">
                        <Select onValueChange={(value) => {fetchTurnsByState(Number(value))}}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1">Pendiente</SelectItem>
                                    <SelectItem value="2">Llamado</SelectItem>
                                    <SelectItem value="3">En atencion</SelectItem>
                                    <SelectItem value="4">Finalizado</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            {tableTurns.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                )
                                })}
                            </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {tableTurns.getRowModel().rows?.length ? (
                            tableTurns.getRowModel().rows.map((row) => (
                                <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                    </TableCell>
                                ))}
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell
                                colSpan={tableTurns.getAllColumns().length}
                                className="h-24 text-center"
                                >
                                Sin resultados.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="text-muted-foreground flex-1 text-sm">
                        {tableTurns.getFilteredSelectedRowModel().rows.length} of{" "}
                        {tableTurns.getFilteredRowModel().rows.length} Fila(s) seleccionadas.
                        </div>
                        <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => tableTurns.previousPage()}
                            disabled={!tableTurns.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => tableTurns.nextPage()}
                            disabled={!tableTurns.getCanNextPage()}
                        >
                            Siguiente
                        </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}