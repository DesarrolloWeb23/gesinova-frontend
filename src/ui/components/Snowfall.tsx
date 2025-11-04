"use client";

import { useEffect } from "react";

export default function Snowfall() {
    useEffect(() => {
        function createSnowflake() {
        const snowflake = document.createElement("div");
        snowflake.innerHTML = "❄";
        snowflake.classList.add("snowflake");

        document.body.appendChild(snowflake);

        const size = Math.random() * 20 + 10 + "px";
        const startPos = Math.random() * window.innerWidth + "px";
        const duration = Math.random() * 5 + 3 + "s";

        snowflake.style.left = startPos;
        snowflake.style.fontSize = size;
        snowflake.style.animation = `fall ${duration} linear infinite`;

        // eliminar después de caer
        setTimeout(() => snowflake.remove(), parseFloat(duration) * 1000);
        }

        const interval = setInterval(createSnowflake, 200);

        // limpiar intervalos al desmontar
        return () => clearInterval(interval);
    }, []);

    return null; // No renderiza nada, solo agrega nieve al DOM
}
