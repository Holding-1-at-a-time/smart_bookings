/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:33:46
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOrganization, SignedIn, OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Home, Calendar, Briefcase, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"

const menuItems = [
    { href: "", icon: Home, label: "Dashboard" },
    { href: "bookings", icon: Calendar, label: "Bookings" },
    { href: "services", icon: Briefcase, label: "Services" },
    { href: "members", icon: Users, label: "Members" },
    { href: "settings", icon: Settings, label: "Settings" },
]

export default function DashboardLayout({
    children,
    params,
}: {
    children: ReactNode
    params: { organizationId: string }
}) {
    const { organization } = useOrganization()
    const pathname = usePathname()

    return (
        <SignedIn>
            <div className="flex h-screen bg-gray-100">
                <Sidebar className="w-64 bg-white border-r">
                    <div className="p-4">
                        <OrganizationSwitcher
                            appearance={{
                                elements: {
                                    rootBox: "flex",
                                    organizationSwitcherTrigger: "bg-gray-100 text-gray-900 px-4 py-2 rounded-md w-full",
                                },
                            }}
                        />
                    </div>
                    <nav className="mt-8">
                        {menuItems.map((item) => {
                            const href = `/dashboard/${params.organizationId}${item.href ? `/${item.href}` : ""}`
                            return (
                                <Link key={item.href} href={href} passHref>
                                    <Button variant={pathname === href ? "default" : "ghost"} className="w-full justify-start mb-1">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                </Sidebar>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white border-b p-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">{organization?.name || "Smart Booking's"}</h1>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10",
                                },
                            }}
                        />
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
                </div>
            </div>
        </SignedIn>
    )
}

