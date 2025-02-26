/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:01:46
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
import { LayoutDashboard, Calendar, DollarSign, Users, Settings, Briefcase } from "lucide-react"

export function AdminNavigation() {
    const { organizationId } = useParams()
    const pathname = usePathname()

    const navItems = [
        { href: `/admin/${organizationId}`, label: "Overview", icon: LayoutDashboard },
        { href: `/admin/${organizationId}/appointments`, label: "Appointments", icon: Calendar },
        { href: `/admin/${organizationId}/revenue`, label: "Revenue", icon: DollarSign },
        { href: `/admin/${organizationId}/tenants`, label: "Tenants", icon: Users },
        { href: `/admin/${organizationId}/services`, label: "Services", icon: Briefcase },
        { href: `/admin/${organizationId}/staff/scheduler`, label: "Staff Scheduler", icon: Settings },
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

