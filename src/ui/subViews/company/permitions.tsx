"use client"

import { Button } from "@/ui/components/ui/button"
import { useState, useEffect } from "react"
import  Loading  from "@/ui/components/Loading"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import {
    ColumnDef,
} from "@tanstack/react-table"
import * as React from "react"
import { Checkbox } from "@/ui/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { GetUserById } from "@/core/domain/use-cases/GetUserById"
import { GetPermissionsInfo } from "@/core/domain/use-cases/GetPermissionsInfo"
import { PermissionApiService } from "@/core/infrastructure/api/services/permissionService"
import { UserApiService } from "@/core/infrastructure/api/services/userService"
import { GroupApiService } from "@/core/infrastructure/api/services/GroupApiService"
import { Permission, PermissionList  } from "@/core/domain/models/Permission";
import { Group } from "@/core/domain/models/Group";
import { User } from "@/core/domain/models/User";
import { toast } from 'sonner'
import { getMessage } from "@/core/domain/messages";
import { GetGroupById } from "@/core/domain/use-cases/GetGroupById"
import { Badge } from "@/ui/components/ui/badge"
import TableGroups from "@/ui/components/TableGroups"
import  { TableUsers } from "@/ui/components/TableUsers"
import TablePermissions from "@/ui/components/TablePermissions"
import { GetGroupsInfo } from "@/core/domain/use-cases/GetGroupsInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/ui/card"


export const columnsPermissions = (handleAssignUserPermission: () => void, handleAssignGroupPermission: () => void, user :User, group :Group): ColumnDef<Permission>[] => [
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

export default function Permitions({ setView }: { setView: (view: string) => void }) {
    const [loading, setLoading] = useState(true);
    const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
    const [permissions, setPermissions] = useState<PermissionList>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [user, setUser] = useState<User>({} as User);
    const [group, setGroup] = useState<Group>({} as Group);
    const [accessDenied, setAccessDenied] = useState(false);
    const [table, setTable] = useState("");


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
    

    //funcion al momento de seleccionar un usuario
    const handleUserSelect = (selectedUser: User, type: string) => {
        setUser(selectedUser);

        if (type === "permissions") {
            handlePermissionUserSelection(selectedUser);
            setTable("permissions");
        } else if (type === "groups") {
            handleGroupUserSelection(selectedUser);
            setTable("groups");
        }
    };

    //funcion al momento de seleccionar un grupo
    const handleGroupSelect = (selectedGroup: Group) => {
        setGroup(selectedGroup);
        handlePermissionGroupSelection(selectedGroup);
        setTable("permissions");
    }

    //funcion para actualizar la variable user
    const handleUpdateUser = async (idUser: number, NewRowSelection: Record<number, boolean>) => {
        setLoading(true);
        const userInfoUseCase = new GetUserById(new UserApiService());
        try {
            await toast.promise(
                userInfoUseCase.execute(idUser)
                .then((response) => {
                    setUser(response);
                    setRowSelection(NewRowSelection);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    throw error;
                }),
                {
                    loading: getMessage("success", "access_loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al iniciar sesión:", error);
        }
    }

    //funcion para actualizar la variable group
    const handleUpdateGroup = async (idGroup: number) => {
        setLoading(true);
        const groupInfoUseCase = new GetGroupById(new GroupApiService());
        try {
            await toast.promise(
                groupInfoUseCase.execute(idGroup)
                .then((response) => {
                    setGroup(response);
                    handlePermissionGroupSelection(response);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    throw error;
                }),
                {
                    loading: getMessage("success", "access_loading"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            setLoading(false);
            console.error("Error al iniciar sesión:", error);
        }
    }

    //funcion para actulizar seleeccion de filas de permisos de usuario
    const handlePermissionUserSelection = (selectedUser: User) => {
        // Obtener permisos del usuario
        const userPermissionCodes = selectedUser.permissions?.map(p => p.codename) ?? [];

        // Calcular qué rows seleccionar
        const newSelection = permissions.reduce((acc, perm, index) => {
            if (userPermissionCodes.includes(perm.codename)) {
            acc[index] = true; 
            }
            return acc;
        }, {} as Record<number, boolean>);

        setRowSelection(newSelection);
    }

    //funcion para actualizar seleccion de filas de permisos de grupos
    const handlePermissionGroupSelection = (selectedGroup: Group) => {
        const groupPermissionCodes = selectedGroup.permissions?.map(p => p.codename) ?? [];

        const newSelection = permissions.reduce((acc, perm, index) => {
            if (groupPermissionCodes.includes(perm.codename)) {
                acc[index] = true;
            }
            return acc;
        }, {} as Record<number, boolean>);

        setRowSelection(newSelection);
    }

    //funcion para actualizar seleccion deee filas de grupos de usuario
    const handleGroupUserSelection = (selectedUser: User) => {
        // Obtener grupos del usuario
        const userGroupIds = selectedUser.groups?.map(g => g.id) ?? [];

        // Calcular qué rows seleccionar
        const newSelection = groups.reduce((acc, perm, index) => {
            if (userGroupIds.includes(perm.id)) {
                acc[index] = true;
            }
            return acc;
        }, {} as Record<number, boolean>);

        setRowSelection(newSelection);
    }

    const handleClearSelectedUser = () => {
        setUser({} as User);
        setGroup({} as Group);
        setRowSelection({});
        setTable("");
    }

    //funcion para manejar el acceso denegado
    const handleAccessDenied = () => {
        setAccessDenied(true);
    }

    useEffect(() => {
        fetchPermissionsData();
        fetchGroupsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
                <p className="mt-2 text-muted-foreground">
                    No tienes permisos para acceder a esta sección.
                </p>
                <Button className="mt-4" onClick={() => setView("")}>Volver</Button>
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <div className="col-span-2 max-sm:col-span-3 p-4 flex items-center justify-center flex h-full">
                    <Loading />
                </div>
            ) : (
                <div className="flex items-center justify-between grid grid-cols-1 gap-3 text-foreground animate-in fade-in slide-in-from-top-8 duration-900">
                    <div className="flex items-center justify-between p-1">
                        <h2 className="font-bold">Permisos de usuario</h2>
                        <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setView("")}
                        >
                            Volver
                        </Button>
                    </div>
                    { Object.keys(user).length > 0 ? (
                    <div className="justify-between p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Datos del usuario */}
                            <Card className="shadow-md border border-gray-200 relative">
                                <div className="absolute top-2 right-4 cursor-pointer"  onClick={() => handleClearSelectedUser()}>
                                    X
                                </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Datos del usuario</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>
                                <span className="font-semibold text-foreground">Nombre:</span> {user.name} {user.lastName}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">Correo:</span> {user.email}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">Usuario:</span> {user.username}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">Fecha de registro:</span>{" "}
                                {user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : "No disponible"}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">Activo:</span> {user.swActive ? "Sí" : "No"}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">Administrador:</span> {user.swAdmin ? "Sí" : "No"}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">MFA Activo:</span> {user.mfaActive ? "Sí" : "No"}
                                </p>
                                <p>
                                <span className="font-semibold text-foreground">MFA Requerido:</span> {user.mfaRequired ? "Sí" : "No"}
                                </p>
                            </CardContent>
                            </Card>

                            {/* Permisos y Grupos */}
                            <Card className="shadow-md border border-gray-200">
                            <CardContent>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-foreground mb-2">Permisos:</h4>
                                    {user.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map((permission) => (
                                        <Badge key={permission.id} variant="secondary">{permission.name}</Badge>
                                        ))}
                                    </div>
                                    ) : (
                                    <p className="text-sm text-muted-foreground">No tiene permisos asignados.</p>
                                    )}
                                </div>


                                <div className="mt-4">
                                    <h4 className="font-semibold text-foreground mb-2">Grupos:</h4>
                                    {user.groups.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                        {user.groups.map((group) => (
                                            <Badge key={group.id} variant="secondary">{group.name}</Badge>
                                        ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No pertenece a ningún grupo.</p>
                                    )}
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                    </div>
                    ): Object.keys(group).length > 0 ? (
                    <div className="flex w-5/6 justify-between p-4">
                        <div className="grid grid-cols-1 gap-6 w-full">
                            {/* visualizar datos del grupo */}
                            <Card className="w-2/5 shadow-md border border-gray-200 relative">
                                <div className="absolute top-2 right-4 cursor-pointer"  onClick={() => handleClearSelectedUser()}>
                                    X
                                </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">
                                    <h3 className="text-lg font-semibold">{group.name}</h3>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="w-3/5">
                                    <h4 className="text-md font-semibold">Permisos:</h4>
                                    <ul className="list-disc list-inside space-y-1 space-x-1">
                                        { group.permissions.length > 0 ? (
                                            group.permissions.map((permission) => (
                                                <Badge key={permission.id}  variant="secondary">{permission.name}</Badge>
                                            ))
                                        ) : (
                                            <li className="text-sm text-muted-foreground">No tiene permisos asignados.</li>
                                        )}
                                    </ul>
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                    </div>
                    ):(
                        <div className="flex w-5/6 justify-between p-4 border border-gray-200 rounded-lg mx-auto">
                            <div className="grid grid-cols-3 gap-3 w-full">
                                <Button className="w-5/6 m-1" variant={table === "groups" ? "tertiary" : "outline"} onClick={() => setTable("groups")}>Grupos</Button>
                                <Button className="w-5/6 m-1" variant={table === "permissions" ? "tertiary" : "outline"} onClick={fetchPermissionsData}>Permisos</Button>
                                <Button className="w-5/6 m-1" variant={table === "users" ? "tertiary" : "outline"} onClick={() => setTable("users")}>Usuarios</Button>
                            </div>
                        </div>
                    )
                    }

                    {table === "groups" && (
                        <TableGroups handleGroupSelect={handleGroupSelect} userSelected={user} newSelection={rowSelection} handleUpdateUser={handleUpdateUser} />
                    )}

                    {table === "permissions" && (
                        <TablePermissions newSelection={rowSelection} userSelected={user} groupSelected={group} handleUpdateUser={handleUpdateUser} handleUpdateGroup={handleUpdateGroup} />
                    )}

                    {table === "users" && (
                        <TableUsers handleUserSelect={handleUserSelect} />
                    )}

                    {table === "" && (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No hay datos para mostrar.
                        </div>
                    )}
                </div>
            )}
        </>
    );
}