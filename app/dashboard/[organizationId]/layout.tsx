/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:24:08
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import type React from "react"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { OrganizationSwitcher } from "@/components/organization-switcher"
import { AccessDenied } from "@/components/access-denied"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, orgId, orgRole } = auth()

  if (!userId || !orgId) {
    redirect("/sign-in")
  }

  if (!["admin", "manager", "detailer", "client"].includes(orgRole)) {
    return <AccessDenied />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 shadow-md">
        <DashboardNavigation />
      </aside>
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <OrganizationSwitcher />
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

