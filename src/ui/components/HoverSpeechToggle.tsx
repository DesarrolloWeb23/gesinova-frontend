"use client";
import { Volume2, VolumeX } from "lucide-react";
import { useHoverSpeech } from "../hooks/useTextToSpeech";
import { Button } from "./ui/button";

export default function HoverSpeechToggle() {
    const { enabled, setEnabled } = useHoverSpeech();

    return (
        <Button
            onClick={() => setEnabled(!enabled)}
            variant="outline" size="icon" 
            aria-label={enabled ? "Desactivar lectura por hover" : "Activar lectura por hover"}
            className={`rounded-l-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl`}
        >
            {enabled ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </Button>
    );
}