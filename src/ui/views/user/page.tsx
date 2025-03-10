import React from "react";

export default function User({ comeBack }: { comeBack: () => void }) {

    return (
      <div>
        <h1>Listado de usuarios</h1>
        <button onClick={comeBack}>Regresar</button>
        <h1>usuario 1</h1>
      </div>
    );
  }