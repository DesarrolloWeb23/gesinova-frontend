import React from "react";

export default function Login({ onLogin }: { onLogin: () => void }) {

    return (
      <div>
        <h1>Iniciar Sesión</h1>
        <button onClick={onLogin}>Ingresar</button>
        <h1>Login</h1>
      </div>
    );
  }