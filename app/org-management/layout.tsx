/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:02:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function OrgManagementLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <ClerkLoading>
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-[#00AE98]" />
                    </div>
                </ClerkLoading>
                <ClerkLoaded>{children}</ClerkLoaded>
            </main>
        </div>
    )
}

