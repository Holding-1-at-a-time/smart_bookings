/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:14:38
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ClerkLoaded, ClerkLoading, OrganizationSwitcher } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white p-6 shadow-md">
                <DashboardNavigation />
            </aside>
            <div className="flex-1">
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
                    <Breadcrumbs />
                    {children}
                </main>
            </div>
        </div>
    )
}

