import TableTurns from "@/ui/components/TableTurns";

export default function Report(){

    //funcion al momento de seleccionar un turno
    const handleTurnSelect = (selectedTurn: Turn) => {
        setTurn(selectedTurn);

        const groupPermissionCodes = selectedGroup.permissions?.map(p => p.codename) ?? [];

        const newSelection = permissions.reduce((acc, perm, index) => {
            if (groupPermissionCodes.includes(perm.codename)) {
                acc[index] = true;
            }
            return acc;
        }, {} as Record<number, boolean>);

        setRowSelection(newSelection);
        setTable("permissions");                 
    }

    return (
        <>
            <TableTurns handleTurnSelect={handleTurnSelect} />
        </>
    );
}