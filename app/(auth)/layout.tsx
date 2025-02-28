/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 08:16:01
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Authentication | Auto Detailing AI",
    description: "Sign in or sign up for Auto Detailing AI",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: "#00AE98",
                },
                elements: {
                    formButtonPrimary: "bg-[#00AE98] hover:bg-[#009B86] text-white",
                    footerActionLink: "text-[#00AE98] hover:text-[#009B86]",
                },
            }}
        >
            <html lang="en">
                <body className={inter.className}>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md w-full space-y-8">{children}</div>
                    </div>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    )
}

