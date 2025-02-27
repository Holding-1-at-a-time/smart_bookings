/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 21:36:11
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Menu, X } from "lucide-react"
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
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-lg font-medium py-2 px-4 rounded-md hover:bg-accent"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

