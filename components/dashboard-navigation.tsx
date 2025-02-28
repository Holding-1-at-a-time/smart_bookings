/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:24:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Briefcase, Settings, Users, BarChart, Car, PenToolIcon as Tool } from "lucide-react"
import { useOrganization } from "@clerk/nextjs"

export function DashboardNavigation() {
    const { organizationId } = useParams()
    const pathname = usePathname()
    const { organization } = useOrganization()

    const role = organization?.membership?.role

    const navItems = [
        {
            href: `/dashboard/${organizationId}`,
            label: "Overview",
            icon: LayoutDashboard,
            roles: ["admin", "manager", "detailer", "client"],
        },
        {
            href: `/dashboard/${organizationId}/bookings`,
            label: "Bookings",
            icon: Calendar,
            roles: ["admin", "manager", "detailer", "client"],
        },
        { href: `/dashboard/${organizationId}/services`, label: "Services", icon: Briefcase, roles: ["admin", "manager"] },
        { href: `/dashboard/${organizationId}/customers`, label: "Customers", icon: Users, roles: ["admin", "manager"] },
        { href: `/dashboard/${organizationId}/analytics`, label: "Analytics", icon: BarChart, roles: ["admin", "manager"] },
        {
            href: `/dashboard/${organizationId}/vehicles`,
            label: "Vehicles",
            icon: Car,
            roles: ["admin", "manager", "detailer"],
        },
        {
            href: `/dashboard/${organizationId}/inventory`,
            label: "Inventory",
            icon: Tool,
            roles: ["admin", "manager", "detailer"],
        },
        { href: `/${organizationId}/settings`, label: "Settings", icon: Settings, roles: ["admin"] },
    ]

    return (
        <nav className="space-y-2">
            {navItems.map((item) => {
                if (role && item.roles.includes(role)) {
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                }
                return null
            })}
        </nav>
    )
}

