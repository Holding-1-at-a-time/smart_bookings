/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:58:57
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { ClerkLoaded, ClerkLoading, OrganizationSwitcher } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <ClerkLoading>
                        <Loader2 className="animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <OrganizationSwitcher
                            appearance={{
                                elements: {
                                    organizationSwitcherTrigger: "bg-[#00AE98] text-white",
                                },
                            }}
                        />
                    </ClerkLoaded>
                </div>
            </header>
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

