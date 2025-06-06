"use client";

import { useEffect, useState } from "react";
import { SessionModal } from "./SessionModal";
import { resolveModal } from "./SessionModalManager";

export const SessionModalProvider = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setOpen(true);
        window.addEventListener("show-session-modal", handleOpen);
        return () => {
        window.removeEventListener("show-session-modal", handleOpen);
        };
    }, []);

    const handleClose = (confirm: boolean) => {
        resolveModal(confirm);
        setOpen(false);
    };

    return (
        <SessionModal
        isOpen={open}
        onClose={() => handleClose(false)}
        onConfirm={() => handleClose(true)}
        />
    );
};
