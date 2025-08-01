"use client"
import * as React from "react"
import { Button } from "@/ui/components/ui/button"
import { Input } from "@/ui/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/components/ui/table"
import { ChevronDown } from "lucide-react"
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
import { Group, GroupList } from "@/core/domain/models/Group";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/components/ui/dialog"
import { Label } from "@/ui/components/ui/label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { GroupApiService } from "@/core/infrastructure/api/services/GroupApiService"
import { toast } from 'sonner'
import { CreateGroup } from "@/core/domain/use-cases/CreateGroup"
import { getMessage } from "@/core/domain/messages";
import  Loading  from "@/ui/components/Loading"
import { GetGroupsInfo } from "@/core/domain/use-cases/GetGroupsInfo"

const formSchema = z.object({
    name: z.string().min(2).max(100),
})

type Props = {
    handleGroupSelect: (group: Group) => void,
}


export const columnsGroups = (handleGroupSelect: (group: Group) => void): ColumnDef<Group>[] => [
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
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
        const groupSelected = row.original

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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() =>  handleGroupSelect(groupSelected)}
                >Gestionar permisos</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )
        },
    },
]

export default function TableGroups( { handleGroupSelect }: Props) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GroupList>([]);
    const [accessDenied, setAccessDenied] = useState(false);
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    //funcion para manejar el acceso denegado
    const handleAccessDenied = () => {
        setAccessDenied(true);
    }

    
    const tableGroups = useReactTable({
        data: groups,
        columns: columnsGroups(handleGroupSelect),
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

    const fetchGroupsData = async () => {
        setLoading(true);
        const groupsInfoUseCase = new GetGroupsInfo(new GroupApiService());
        try {
            await toast.promise(
                groupsInfoUseCase.execute()
                .then((response) => {
                    setGroups(response);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);

                    // Manejo específico de error de permisos
                    if (error?.status === 'ACCESS_DENIED') {
                        handleAccessDenied();
                        return;
                    }

                    throw error;
                }),
                {
                    loading: getMessage("success", "loading"),
                    success: getMessage("success", "success"),
                    error: (error) => 
                        error?.message
                } 
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al iniciar sesión:", error);
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSubmitting) return;
        setIsSubmitting(true); // Establece el estado de envío a verdadero
        const createGroupUseCase = new CreateGroup(new GroupApiService());

        try {
            await toast.promise(
            createGroupUseCase.execute(values.name)  
            .then((response) => {

                if (response) {
                    setIsSubmitting(false);
                    return;
                }

                })
                .catch((error) => {
                setIsSubmitting(false);
                throw error;
                }),
            {
                loading: getMessage("success", "access_loading"),
                success: getMessage("success", "access_success"),
                error: (error) => 
                error?.message
            }
            );
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error al iniciar sesión:", error);
        }
    }

    useEffect(() => {
        fetchGroupsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {loading ? (
                <div className="max-sm:col-span-3 justify-between p-4">
                    <Loading />
                </div>
            ) : (
                <div className="w-full p-4">
                    <div className="flex items-center py-4 space-x-2">
                        <Input
                        placeholder="Filtrar permiso..."
                        value={(tableGroups.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            tableGroups.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        />
                        <Dialog>
                            <form onSubmit={form.handleSubmit(onSubmit)} > 
                                <DialogTrigger asChild>
                                <Button variant="outline">Crear grupo</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Crear grupo</DialogTitle>
                                    <DialogDescription>
                                    Completa los campos a continuación para crear un nuevo grupo.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                    <Label htmlFor="name-1">Nombre</Label>
                                    <Input id="name-1" name="name" defaultValue="PERMISO_EJEMPLO" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                    </DialogClose>
                                    <Button type="submit">Guardar cambios</Button>
                                </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                Columnas <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {tableGroups
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.columnDef.header as string}
                                    </DropdownMenuCheckboxItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            {tableGroups.getHeaderGroups().map((headerGroup) => (
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
                            {tableGroups.getRowModel().rows?.length ? (
                            tableGroups.getRowModel().rows.map((row) => (
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
                                colSpan={tableGroups.getAllColumns().length}
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
                        {tableGroups.getFilteredSelectedRowModel().rows.length} of{" "}
                        {tableGroups.getFilteredRowModel().rows.length} Fila(s) seleccionadas.
                        </div>
                        <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => tableGroups.previousPage()}
                            disabled={!tableGroups.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => tableGroups.nextPage()}
                            disabled={!tableGroups.getCanNextPage()}
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