/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:38:08
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNavigation() {
    const { organizationId } = useParams()
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { href: `/${organizationId}`, label: "Home" },
        { href: `/${organizationId}/services`, label: "Services" },
        { href: `/${organizationId}/booking`, label: "Book Now" },
        { href: `/${organizationId}/chat`, label: "Chat" },
        { href: `/${organizationId}/dashboard`, label: "Dashboard" },
    ]

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                    <Menu />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

