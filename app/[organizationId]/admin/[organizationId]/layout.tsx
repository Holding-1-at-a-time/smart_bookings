/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:14:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { AdminNavigation } from "@/components/admin-navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-100 p-6">
                <AdminNavigation />
            </aside>
            <main className="flex-1 p-8">
                <Breadcrumbs />
                {children}
            </main>
        </div>
    )
}

