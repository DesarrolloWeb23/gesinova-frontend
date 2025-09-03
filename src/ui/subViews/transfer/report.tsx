import { Turn } from "@/core/domain/models/Turn";
import TableTurns from "@/ui/components/TableTurns";
import { useState } from "react";

export default function Report(){
    const [turn, setTurn] = useState<Turn | null>(null);

    //funcion al momento de seleccionar un turno
    const handleTurnSelect = (selectedTurn: Turn) => {
        setTurn(selectedTurn);
        console.log("Turno seleccionado:", turn);
    }

    return (
        <>
            <TableTurns handleTurnSelect={handleTurnSelect} />
        </>
    );
} 