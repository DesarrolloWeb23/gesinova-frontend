import { useEffect, useState } from "react";
import { decodeJwt, JwtPayload } from "@/lib/jwt";

export const useAuthHook = () => {
    const [usertoken, setUser] = useState<JwtPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
        setUser(decodeJwt(token));
        } else {
        setUser(null);
        }
    }, []);
    
    return { usertoken };
};