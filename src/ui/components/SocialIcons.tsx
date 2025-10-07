import * as React from 'react'
import { Facebook, Youtube } from "lucide-react"
import { BsWhatsapp } from 'react-icons/bs';

function SocialIcons() {

    return (
        <div className="flex items-center justify-center gap-6">
            <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.pijaossalud.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Facebook"
            >
            <Facebook className="w-5 h-5" />
            </a>

            <a
            href="https://api.whatsapp.com/send?text=Inicio https%3A%2F%2Fwww.pijaossalud.com%2F"
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
