import React from "react";

export default function Dasboard({ listUser, comeBack }: { listUser: () => void, comeBack: () => void }) {

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <button onClick={listUser}>ver usuarios</button>
            <button onClick={comeBack}>Regresar</button>
            <h1>Dashboard</h1>
        </div>
        );
    }