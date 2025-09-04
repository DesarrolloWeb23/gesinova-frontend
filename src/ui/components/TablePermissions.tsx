"use client"
import * as React from "react"
import Loading from "./Loading";
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
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Permission, PermissionList  } from "@/core/domain/models/Permission";
import { toast } from "sonner";
import { Input } from "@/ui/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/components/ui/table"
import { ChevronDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { GetPermissionsInfo } from "@/core/domain/use-cases/GetPermissionsInfo"
import { PermissionApiService } from "@/core/infrastructure/api/services/permissionService"
import { getMessage } from "@/core/domain/messages";
import { User } from "@/core/domain/models/User";
import { Group } from "@/core/domain/models/Group";
import { AssignPermissionToUser } from "@/core/domain/use-cases/AssignPermissionToUser";
import { AssignPermissionToGroup } from "@/core/domain/use-cases/AssignPermissionToGroup";

type Props = {
    newSelection?: Record<number, boolean>,
    userSelected: User,
    groupSelected: Group
    handleUpdateUser: (id: number) => Promise<void>;
    handleUpdateGroup: (id: number) => Promise<void>;
}

export const columnsPermissions = (handleAssignUserPermission: () => void, handleAssignGroupPermission: () => void, user: User, group: Group,): ColumnDef<Permission>[] => [
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
        cell: () => {
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
                    { Object.keys(user).length > 0 ?  (
                        <DropdownMenuItem
                        onClick={() => handleAssignUserPermission()}
                        >
                        Asignar permiso a usuario
                        </DropdownMenuItem>
                    ) : 
                    Object.keys(group).length > 0 ? (
                        <DropdownMenuItem
                        onClick={() => handleAssignGroupPermission()}
                        >
                        Asignar permiso a grupo
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem disabled>
                            Sin acciones
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function TablePermissions({
    newSelection = {},
    userSelected,
    groupSelected,
    handleUpdateUser,
    handleUpdateGroup
    }: Props) {

    const [permissions, setPermissions] = useState<PermissionList>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<Record<number, boolean>>({});
    const [accessDenied, setAccessDenied] = useState(false);

    //funcion para manejar el acceso denegado
    const handleAccessDenied = () => {
        setAccessDenied(true);
    }

    //funcion para asignar permisos a un usuario
    const handleAssignUserPermission = async () => {
        setLoading(true);
        const assignPermissionsUserUseCase = new AssignPermissionToUser(new PermissionApiService());
        
        if (!userSelected) {
            toast.error("Por favor, selecciona un usuario primero.");
            setLoading(false);
            return;
        }
        
        try {
            // Obtener los permisos seleccionados
            const selectedPermissionCodenames = permissions.filter((_, index) => rowSelection[index]).map(p => p.codename);

            await toast.promise(

                assignPermissionsUserUseCase.execute(userSelected.username, selectedPermissionCodenames)
                .then(async (response) => {
                    if (response.message === "PERMISSION_ASSIGNED") {
                        await handleUpdateUser(userSelected.id);

                    }
                })       
                .catch((error) => {
                    setLoading(false); 
                    throw error;
                }),
                {
                    loading:  getMessage("success", "sending"),
                    success: getMessage("success", "assignUserPermission_success"),
                    error: (error) => 
                    error?.message
                }
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al asignar permiso:", error);
        }
    }

    //funcion para asignar permisos a un grupo
    const handleAssignGroupPermission = async () => {
        setLoading(true);
        const assignPermissionsGroupUseCase = new AssignPermissionToGroup(new PermissionApiService());

        if(!groupSelected) {
            toast.error("Por favor, selecciona un grupo primero.");
            setLoading(false);
            return;
        }
        
        try {
            const selectedPermissionCodenames = permissions.filter((_, index) => rowSelection[index]).map(p => p.codename);
            
            await toast.promise(
                assignPermissionsGroupUseCase.execute(groupSelected.id, selectedPermissionCodenames)
                .then(async (response) => {
                    if (response.message === "PERMISSION_ASSIGNED") {
                        await handleUpdateGroup(groupSelected.id);
                    }
                    setLoading(false);
                })       
                .catch((error) => {
                    setLoading(false);
                    throw error;
                }),
                {
                    loading: getMessage("success", "sending"),
                    success: getMessage("success", "assignGroupPermission_success"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al asignar permiso:", error);
        }
    }

    const fetchPermissionsData = async () => {
        setLoading(true);
        const adminPermissionsUseCase = new GetPermissionsInfo(new PermissionApiService());
        try {
            await toast.promise(
                adminPermissionsUseCase.execute()
                .then((response) => {
                    setPermissions(response);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);

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
            setLoading(false);
            console.error("Error al iniciar sesión:", error);
        }
    }

    const tablePermissions = useReactTable({
        data: permissions,
        columns: columnsPermissions(handleAssignUserPermission, handleAssignGroupPermission, userSelected, groupSelected),
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

    useEffect(() => {
        setRowSelection(newSelection);
        fetchPermissionsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="max-sm:col-span-3 justify-between p-4">
                <Loading />
            </div>
        );
    }

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
            <div className="w-full p-4">
                <div className="flex items-center py-4">
                    <Input
                    placeholder="Filtrar permiso..."
                    value={(tablePermissions.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        tablePermissions.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    />
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                        Columnas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {tablePermissions
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
                        {tablePermissions.getHeaderGroups().map((headerGroup) => (
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
                        {tablePermissions.getRowModel().rows?.length ? (
                        tablePermissions.getRowModel().rows.map((row) => (
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
                            colSpan={tablePermissions.getAllColumns().length}
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
                    {tablePermissions.getFilteredSelectedRowModel().rows.length} of{" "}
                    {tablePermissions.getFilteredRowModel().rows.length} Fila(s) seleccionadas.
                    </div>
                    <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tablePermissions.previousPage()}
                        disabled={!tablePermissions.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tablePermissions.nextPage()}
                        disabled={!tablePermissions.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                    </div>
                </div>
            </div>
        </>
    );
}