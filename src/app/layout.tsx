import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/ui/context/AuthContext";
import { SessionModalProvider } from "@/ui/context/SessionModalContext";
import { ThemeProvider } from "@/ui/context/ThemeContext"
import { AccessibilityButton } from "@/ui/components/AccessibilityButton";
import { FontSizeProvider } from "@/ui/context/FontSizeContext";
import { ViewProvider } from "@/ui/context/ViewContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gesinova",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description: "Gestión de usuarios",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionModalProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <FontSizeProvider>
                <ViewProvider>
                  {children}
                  <AccessibilityButton />
                </ViewProvider>
              </FontSizeProvider>
            </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
