import { FaLongArrowAltRight } from "react-icons/fa"

interface GoToProps {
    message: string
    link: string
}

const GoTo : React.FC<GoToProps> = ({ message, link }) => {
    return(
        <div className="flex items-center justify-center gap-2 absolute top-2 right-4 cursor-pointer text-sm text-blue-600 hover:underline">
            <a href={link} target="_blank">{message}</a>
            <FaLongArrowAltRight />
        </div>
    )
}

export default GoTo