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
    PaginationState,
} from "@tanstack/react-table"
import { Checkbox } from "@/ui/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { User, UserList } from "@/core/domain/models/User"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/components/ui/select"
import { FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GetUsersInfo } from "@/core/domain/use-cases/GetUsersInfo"
import { UserApiService } from "@/core/infrastructure/api/services/userService"
import { toast } from 'sonner'
import { getMessage } from "@/core/domain/messages";
import  Loading  from "@/ui/components/Loading"
import { GetUserByUserName } from "@/core/domain/use-cases/GetUserByUserName"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/ui/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

type Props = {
    handleUserSelect: (user: User) => void,
}

type CompUserProps = {
    onSearch: (values: z.infer<typeof formSchema>) => void;
};

const formSchema = z.object({
    userName: z.string().min(2, getMessage("errors", "zod_username_required")),
    security_emails: z.boolean(),
})

async function fetchUserByUserNameFn(
    values: z.infer<typeof formSchema>,
    setUsers: React.Dispatch<React.SetStateAction<UserList>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    handleAccessDenied: () => void
    ) {
    setLoading(true);
    const userByUserNameUseCase = new GetUserByUserName(new UserApiService());
    try {
        await toast.promise(
        userByUserNameUseCase.execute(values.userName)
            .then((response) => {
            setUsers(response);
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
            success: getMessage("success", "success"),
            error: (error) => error?.message
        }
        );
    } catch (error) {
        setLoading(false);
        console.error("Error al buscar usuario:", error);
    }
}

export const columnsUsers = (handleUserSelect: (user: User) => void): ColumnDef<User>[] => [
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
        accessorKey: "username",
        header: "Código de usuario",
        cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
        ),
    },
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "swActive",
        header: "Activo",
        cell: ({ row }) => (
        <div className="capitalize">{row.getValue("swActive") === 'YES' ? <FaCheck /> : <FcCancel />}</div>
        ),
    },
    {
        accessorKey: "swAdmin",
        header: "Administrador",
        cell: ({ row }) => (
        <div className="capitalize">{row.getValue("swAdmin")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
        const userSelected = row.original

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
                onClick={() =>  handleUserSelect(userSelected)}
                >Gestionar permisos</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )
        },
    },
]

//funcion para exportar componente para buscar usuario especifico
function CompUser({ onSearch }: CompUserProps)  {

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
            userName: "",
            security_emails: true,
        },
    })

    return (
        <div className="w-2/5 text-center">
            <div className="m-2">
                <p>Buscar usuario por nombre de usuario</p>
            </div>
            <Form {...form}>
                <form className="flex items-center justify-between m-2">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nombre de usuario"
                                        className="w-full max-w-xs m-2"
                                        {...field} 
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                <Button
                    onClick={() => onSearch(form.getValues())}
                >
                    Buscar usuario
                </Button>
                </form>
            </Form>
            <div className="flex items-center justify-between m-2">
            </div>
        </div>
    )
}

function TableUsers({handleUserSelect }: Props) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const options = [10, 20, 30, 40, 50]
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserList>([]);
    const [accessDenied, setAccessDenied] = useState(false);
    
    const tableUsers = useReactTable({
        data: users,
        columns: columnsUsers(handleUserSelect),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            pagination,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    
    const handleSearchByUsername = (values: z.infer<typeof formSchema>) => {
        fetchUserByUserNameFn(values, setUsers, setLoading, handleAccessDenied);
    };

    const fetchUsersData = async () => {
        setLoading(true);
        const usersInfoUseCase = new GetUsersInfo(new UserApiService());
        try {
            await toast.promise( 
                usersInfoUseCase.execute()
                .then((response) => {
                    setUsers(response);
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

    const handleAccessDenied = () => {
        setAccessDenied(true);
    }

    useEffect(() => {
        fetchUsersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const allOption = tableUsers.getFilteredRowModel().rows.length.toString()

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
                    <CompUser onSearch={handleSearchByUsername} />
                    <div className="flex items-center py-4">
                        <Input
                        placeholder="Filtrar permiso..."
                        value={(tableUsers.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            tableUsers.getColumn("name")?.setFilterValue(event.target.value)
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
                            {tableUsers
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
                            {tableUsers.getHeaderGroups().map((headerGroup) => (
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
                            {tableUsers.getRowModel().rows?.length ? (
                            tableUsers.getRowModel().rows.map((row) => (
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
                                colSpan={tableUsers.getAllColumns().length}
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
                            {tableUsers.getFilteredSelectedRowModel().rows.length} of{" "}
                            {tableUsers.getFilteredRowModel().rows.length} Fila(s) seleccionadas.
                        </div>
                        <Select
                        value={tableUsers.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            tableUsers.setPageSize(Number(value))
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
                                onClick={() => tableUsers.previousPage()}
                                disabled={!tableUsers.getCanPreviousPage()}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => tableUsers.nextPage()}
                                disabled={!tableUsers.getCanNextPage()}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}



export { TableUsers, CompUser }