import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    permissions: string[];
    [key: string]: any; // por si tu token trae más claims
}

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error("Error decoding JWT", error);
        return null;
    }
};