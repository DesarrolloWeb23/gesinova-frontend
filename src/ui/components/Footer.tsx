import SocialIcons from "./SocialIcons"

export const Footer = () => {
    return (
        <div className="text-center text-xs">
            <div><b>© 2025 Gesinova | Todos los derechos reservados</b></div>
            <div><a target="_blank" href="https://docs.google.com/viewerng/viewer?url=http://www.pijaossalud.com/wp-content/uploads/2020/08/Politica-de-Proteccion-de-datos.pdf&hl">Política Tratamiento de Datos</a></div>
            <div>Línea Nacional Gratuita 01 8000 186754</div>
            <div className="flex items-center justify-center mt-2">
                <SocialIcons />
            </div>
        </div>
    )
}