import React from "react";

export default function Dasboard({ listUser, comeBack, mensaje }: { listUser: () => void, comeBack: () => void, mensaje: string }) {

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <button onClick={listUser}>ver usuarios</button>
            <button onClick={comeBack}>Regresar</button>
            <h1>Dashboard</h1>
            este es el mensaje recibido: {mensaje}
        </div>
        );
    }