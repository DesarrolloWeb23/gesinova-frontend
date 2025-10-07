import { useEffect, useState, useRef } from "react";

export function useHoverSpeech() {
    const [enabled, setEnabled] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        // Solo se ejecuta en el cliente
        if (typeof window !== "undefined") {
        synthRef.current = window.speechSynthesis;
        }
    }, []);

    const speak = (text: string) => {
        if (!synthRef.current || !text.trim()) return;
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1;
        utterance.pitch = 1;

        synthRef.current.speak(utterance);
    };

    const stop = () => {
        if (synthRef.current) synthRef.current.cancel();
    };

    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
        stop();
        return;
        }

        const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const text = target.innerText?.trim();

        if (text && text.length > 2 && !target.closest(".no-voice")) {
            speak(text);
        }
        };

        const handleMouseOut = () => stop();

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
        stop();
        };
    }, [enabled]);

    return { enabled, setEnabled };
}
