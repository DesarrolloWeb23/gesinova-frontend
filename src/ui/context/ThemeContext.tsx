"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
    }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <div className="snowflakes">
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="60" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
                <div className="snowflake">
                    <img src="https://i.pinimg.com/originals/d1/96/a9/d196a94b9d8cda6edfd3a65237aa8fb5.gif" 
                        width="50" 
                        alt="155b4588f223ce388f2542198570256b.gif" />
                </div>
            </div>
            {children}
        </NextThemesProvider>
    )
}
