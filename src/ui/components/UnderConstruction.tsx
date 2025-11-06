import { Construction } from "lucide-react";

export default function UnderConstruction({ title = "Página en construcción" }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Construction className="w-16 h-16 text-yellow-500 animate-bounce mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 mt-2">
                Estamos trabajando en esta funcionalidad. ¡Vuelve pronto!
            </p>
        </div>
    );
}