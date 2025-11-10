import * as React from "react"
import { getMessage } from "@/core/domain/messages";
import { TransferService } from "@/core/infrastructure/api/services/TransferService";
import Loading from "@/ui/components/Loading";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    ColumnDef
} from "@tanstack/react-table";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/ui/components/ui/dropdown-menu";
import { Button } from "@/ui/components/ui/button";
import { Download, MoreHorizontal } from "lucide-react";
import { GetReportTurns } from "@/core/domain/use-cases/GetReportTurns";
import { ReportTurns } from "@/core/domain/models/ReportTurns";
import TableReportTurns from "@/ui/components/TableReportTurns";
import { exportToExcel } from "@/lib/exportToExcel";
import { decodeJwt, JwtPayload } from "@/lib/jwt";

export const columnsTurns = (handleTurnSelect: (turn: ReportTurns) => void): ColumnDef<ReportTurns>[] => [
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
        accessorFn: (row) => row.department, 
        id: "department",
        header: "Departamento",
        cell: ({ row }) => <div className="uppercase">{row.original.department}</div>,
    },
    {
        accessorFn: (row) => row.municipality, 
        id: "municipality",
        header: "Municipio",
        cell: ({ row }) => <div className="uppercase">{row.original.municipality}</div>,
    },
    {
        accessorFn: (row) => row.attendedDate, 
        id: "attendedDate",
        header: "Fecha de atención",
        cell: ({ row }) => <div className="uppercase">{row.original.attendedDate}</div>,
    },
    {
        accessorFn: (row) => row.assignedDate, 
        id: "assignedDate",
        header: "Fecha de asignación",
        cell: ({ row }) => <div className="uppercase">{row.original.assignedDate}</div>,
    },
    {
        accessorFn: (row) => row.attentionTime, 
        id: "attentionTime",
        header: "Tiempo de atención",
        cell: ({ row }) => <div className="uppercase">{row.original.attentionTime}</div>,
    },
    {
        accessorFn: (row) => row.lastAttendedDate, 
        id: "lastAttendedDate",
        header: "Fecha de ultima atención",
        cell: ({ row }) => <div className="uppercase">{row.original.lastAttendedDate}</div>,
    },
    {
        accessorFn: (row) => row.totalAttentionTime, 
        id: "totalAttentionTime",
        header: "Tiempo total de atención",
        cell: ({ row }) => <div className="uppercase">{row.original.totalAttentionTime}</div>,
    },
    {
        accessorFn: (row) => row.userProcess, 
        id: "userProcess",
        header: "Usuario",
        cell: ({ row }) => <div className="uppercase">{row.original.userProcess}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
        const turnSelected = row.original

        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild className="invisible">
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
    const [turn, setTurn] = useState<ReportTurns | null>(null);
    const [turns, setTurns] = useState<ReportTurns[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [pageSize, setPageSize] = useState(100);
    const [downloadPermission, setDownloadPermission] = useState(false);

    //funcion al momento de seleccionar un turno
    const handleTurnSelect = (selectedTurn: ReportTurns) => {
        setTurn(selectedTurn);
        console.log("Turno seleccionado:", turn);
    }

    const handleExport = () => {
        exportToExcel(turns, "Reporte_Turnos");
    };

    const handleGetReportTurns = () => {
        setIsLoading(true);
        const getTurnsUseCase = new GetReportTurns(new TransferService());
        try {
            toast.promise( 
                getTurnsUseCase.execute( "1", pageSize.toString())
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
    }

    const validateUserPermissions = () => {
        setDownloadPermission(false);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        let usertoken: JwtPayload | null;

        if (token) {
            usertoken = decodeJwt(token);
        } else {
            usertoken = null;
        }

        if (usertoken) {
            //recorre el usertoken.permissions  para validar si tiene permiso de s uper admin
            const hasSuperAdminPermission = usertoken.permissions.includes("SUPER_ADMIN");
            if (!hasSuperAdminPermission) {
                setDownloadPermission(true);
            }
        }
    };

    useEffect(() => {
        validateUserPermissions();
        setIsLoading(true);
        const getTurnsUseCase = new GetReportTurns(new TransferService());
        try {
            toast.promise( 
                getTurnsUseCase.execute( "1", pageSize.toString())
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
    }, [pageSize]); 

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-semibold text-red-600">Acceso Denegado</h2>
                <p className="mt-2 text-muted-foreground">
                    No tienes permisos para acceder a esta sección.
                </p>
            </div>
        );
    }

    //validacion si la peticion a la API no se completo
    if (!turns.length) {
        return (
            <div className="col-span-2 max-sm:col-span-3 p-4 flex flex-col items-center justify-center gap-4 h-full">
                <div>No se pudieron cargar los datos</div>
                <div>
                    <Button
                        onClick={() => {
                            handleGetReportTurns();
                        }}
                    >
                    Reintentar
                    </Button>
                </div>
            </div>
        );
    }

return (
    <>   
        {isLoading ? (
            <Loading />
        ) : (
            <>
                <div className="relative flex justify-end items-center mb-4">
                    <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-foreground">REPORTE DE TURNOS</h1>
                    <Button 
                        onClick={handleExport} 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        disabled={downloadPermission}
                    >
                        <Download className="w-4 h-4" />
                        Descargar Excel
                    </Button>
                </div>

                <TableReportTurns 
                    handleTurnSelect={handleTurnSelect} 
                    turnsReceived={turns} 
                    columnsTurnsReceived={columnsTurns(handleTurnSelect)} 
                    setPageSize={setPageSize}
                />
            </>
        )}
    </>
);
} 