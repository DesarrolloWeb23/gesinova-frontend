import * as React from 'react'
import { Facebook, Youtube } from "lucide-react"
import { BsWhatsapp } from 'react-icons/bs';

function SocialIcons() {

    return (
        <div className="flex items-center justify-center gap-6">
            <a
            href="https://m.facebook.com/people/Pijaos-Salud-Eps-Indigena/100072430669698/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Facebook"
            >
            <Facebook className="w-5 h-5" />
            </a>

            <a
            href="https://wa.me/573102133504"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground transition-colors"
            aria-label="WhatsApp"
            >
            <BsWhatsapp className="w-5 h-5" />
            </a>

            <a
            href="https://www.youtube.com/channel/UCwblJFABwBn1NHvAhgxPCIw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground transition-colors"
            aria-label="YouTube"
            >
            <Youtube className="w-5 h-5" />
            </a>
        </div>
    );
}
export default SocialIcons;
