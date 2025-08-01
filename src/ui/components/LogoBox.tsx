"use client"

interface LogoBoxProps {
    turno: string
}

export default function LogoBox({ turno }: LogoBoxProps) {
    return (
        <div className="animate-in fade-in slide-in-from-top-8 duration-900 max-w-1/2 w-full m-1">
            <div className="text-center text-2xl font-bold mb-4">
                Turno {turno}
            </div>
            <div className="logo-box relative flex justify-center items-center w-[150px] h-[150px] rounded-[20px] border-2 border-secondary bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(0,0,0,0.2))] shadow-custom">
                {/* Puedes agregar un ícono o número aquí si quieres */}
            </div>
        </div>
    )
}