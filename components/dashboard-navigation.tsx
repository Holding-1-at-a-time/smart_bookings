/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:02:34
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Briefcase, Settings } from "lucide-react"

export function DashboardNavigation() {
    const { organizationId } = useParams()
    const pathname = usePathname()

    const navItems = [
        { href: `/dashboard/${organizationId}`, label: "Overview", icon: LayoutDashboard },
        { href: `/dashboard/${organizationId}/bookings`, label: "Bookings", icon: Calendar },
        { href: `/dashboard/${organizationId}/services`, label: "Services", icon: Briefcase },
        { href: `/${organizationId}/settings`, label: "Settings", icon: Settings },
    ]

    return (
        <nav className="space-y-2">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Button>
                </Link>
            ))}
        </nav>
    )
}