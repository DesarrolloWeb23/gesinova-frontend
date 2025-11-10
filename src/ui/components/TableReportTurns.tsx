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
import  Loading  from "@/ui/components/Loading"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ReportTurns } from "@/core/domain/models/ReportTurns"

import { Calendar } from "@/ui/components/ui/calendar"
import { Label } from "@/ui/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/ui/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Separator } from "./ui/separator"

type Props = {
    handleTurnSelect: (turn: ReportTurns) => void,
    turnsReceived: ReportTurns[]
    columnsTurnsReceived: ColumnDef<ReportTurns>[]
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export const columnsTurns = (handleTurnSelect: (turn: ReportTurns) => void): ColumnDef<ReportTurns>[] => [
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
        accessorFn: (row) => row.attentionService, 
        id: "attentionService",
        header: "Servicio",
        cell: ({ row }) => <div className="uppercase">{row.original.attentionService}</div>,
    },
    {
        accessorFn: (row) => row.classificationAttention, 
        id: "classificationAttention",
        header: "Clasificación",
        cell: ({ row }) => <div className="uppercase">{row.original.classificationAttention}</div>,
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

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export default function TableReportTurns( { handleTurnSelect, turnsReceived, columnsTurnsReceived}: Props){
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [turns, setTurns] = useState<ReportTurns[]>([]);
    const options = [10, 20, 30, 40, 50]
    const [allTurns, setAllTurns] = useState<ReportTurns[]>([]);

    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [value, setValue] = React.useState(formatDate(date))

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [userFilter, setUserFilter] = useState<string>("");


    //funcion para filtrar por fecha
    const handleDateSelect = (date: Date | undefined) => {
        setTurns(allTurns);
        //toma los turnos y filtra por la fecha seleccionada
        if (!date) return;

        const normalize = (d: Date) => d.toISOString().split("T")[0];

        const selectedDate = normalize(date);

        const filtered = allTurns.filter(turn => {
            const turnDate = normalize(new Date(turn.attendedDate));
            return turnDate === selectedDate;
        });
        setTurns(filtered);
    };

    //funcion para filtrar por estado //(falta incluir en el endpoint los estados de los turnos)
    const handleStatusFilter = () => {
        // setTurns(allTurns);

        // if (!status) return;

        // const filtered = allTurns.filter(turn => {
        //     return turn.status === status;
        // })
        // setTurns(filtered);
    }

    //funcion para filtrar por usuario
    const handleUserFilter = (user: string) => {
        setTurns(allTurns);

        if (!user) return;

        const filtered = allTurns.filter(turn => {
            return turn.userProcess === user.toUpperCase();
        })
        setTurns(filtered);
    }

    const tableTurns = useReactTable({
        data: turns,
        columns: columnsTurnsReceived ? columnsTurnsReceived : columnsTurns(handleTurnSelect),
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

    const allOption = tableTurns.getFilteredRowModel().rows.length.toString();

    useEffect(() => {
        setTurns(turnsReceived)
        setAllTurns(turnsReceived)
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    //funcion para reiniciar los filtros
    const handleReset = () => {
        setStatusFilter("");
        setTurns(allTurns);
        setDate(undefined);
        setUserFilter("");
        setValue("");
    }

    return (
        <>
            {isLoading ? (
                <div className="max-sm:col-span-3 justify-between p-4">
                    <Loading />
                </div>
            ) : (
                <div className="grid grid-cols-6 w-full p-4">
                    <div className="col-span-4 col-start-2 w-5/6 ">
                        <div className="flex items-center gap-3">
                            {/*filtro por fecha de atencion*/}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date" className="px-1">
                                    Fecha de atencion
                                </Label>
                                <div className="relative flex max-w-sm">
                                    <Input
                                    id="date"
                                    value={value}
                                    placeholder="June 01, 2025"
                                    className="bg-background pr-10"
                                    onChange={(e) => {
                                        const date = new Date(e.target.value)
                                        setValue(e.target.value)
                                        if (isValidDate(date)) {
                                        setDate(date)
                                        setMonth(date)
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowDown") {
                                        e.preventDefault()
                                        setOpen(true)
                                        }
                                    }}
                                    />
                                    <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                        id="date-picker"
                                        variant="ghost"
                                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                        >
                                        <CalendarIcon className="size-3.5" />
                                        <span className="sr-only">Select date</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="end"
                                        alignOffset={-8}
                                        sideOffset={10}
                                    >
                                        <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        month={month}
                                        onMonthChange={setMonth}
                                        onSelect={(date) => {
                                            setDate(date)
                                            setValue(formatDate(date))
                                            handleDateSelect(date)
                                            setOpen(false)
                                        }}
                                        />
                                    </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            {/*filtro por estado*/}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date" className="px-1">
                                    Estado
                                </Label>
                                <div className="relative flex max-w-sm">
                                    <Select 
                                        value={statusFilter} 
                                        onValueChange={
                                            (value) => {
                                                setStatusFilter(value);
                                                handleStatusFilter();
                                            }}
                                        disabled={true}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Filtrar por estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={"1"}>Pendiente</SelectItem>
                                            <SelectItem value={"2"}>Llamado</SelectItem>
                                            <SelectItem value={"3"}>En atención</SelectItem>
                                            <SelectItem value={"4"}>Finalizado</SelectItem>
                                            <SelectItem value={"5"}>Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/*filtro por usuario*/}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date" className="px-1">
                                    Usuario
                                </Label>
                                <div className="relative flex max-w-sm">
                                    <Input
                                    id="user"
                                    placeholder="Filtrar por usuario"
                                    className="bg-background pr-10"
                                    value={userFilter}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setUserFilter(value);
                                        handleUserFilter(value);
                                    }}
                                    /> 
                                </div>
                            </div>
                            {/*filtro por Codigo*/}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="date" className="px-1">
                                    Código de turno
                                </Label>
                                <div className="relative flex max-w-sm">
                                    <Input
                                        placeholder="Filtrar turno..."
                                        value={(tableTurns.getColumn("turnCode")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            tableTurns.getColumn("turnCode")?.setFilterValue(event.target.value)
                                        }
                                        className="max-w-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <Separator className="my-4" />
                    </div>
                    <div className="col-start-1 col-end-7 flex items-center py-4">
                        <Button variant={"outline"} className="ml-auto"
                            onClick={() => {
                                handleReset();
                            }}
                            >Limpiar filtros</Button>
                    </div>
                    <div className="col-start-1 col-end-7 rounded-md border">
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
                    <div className="col-start-1 col-end-7 flex items-center justify-end space-x-2 py-4">
                        <div className="text-muted-foreground flex-1 text-sm">
                        {tableTurns.getFilteredSelectedRowModel().rows.length} of{" "}
                        {tableTurns.getFilteredRowModel().rows.length} Fila(s) seleccionadas.
                        </div>
                        <Select
                        value={tableTurns.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            tableTurns.setPageSize(Number(value));
                        }}
                        >
                            <SelectTrigger className="w-[130px] h-9">
                                <SelectValue placeholder="Filas por página" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    Mostrar {pageSize}
                                </SelectItem>
                                ))}
                                <SelectItem value={allOption}>Mostrar todo</SelectItem>
                            </SelectContent>
                        </Select>
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