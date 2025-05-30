import { messages as en } from "./en";
import { messages as es } from "./es";

const languages = { en, es };

export type Lang = keyof typeof languages;

const safeLang =
  typeof window !== "undefined"
    ? (localStorage.getItem("lang") as Lang) || "es"
    : "es";

export const getMessage = (
    type: "errors" | "success" | "ui",
    key: string,
    lang: Lang = safeLang
): string => {
    const section = languages[lang]?.[type] as Record<string, string>;
    return section?.[key] || key;
};