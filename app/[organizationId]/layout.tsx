/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:38:44
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CustomerLayout({ children }: { children: ReactNode }) {
    const { organizationId } = useParams()

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-primary-foreground">
                <nav className="container mx-auto px-6 py-3">
                    <ul className="flex space-x-4">
                        <li>
                            <Link href={`/${organizationId}`} className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${organizationId}/services`} className="hover:underline">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${organizationId}/booking`} className="hover:underline">
                                Book Now
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${organizationId}/dashboard`} className="hover:underline">
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
            <footer className="bg-secondary text-secondary-foreground">
                <div className="container mx-auto px-6 py-3 text-center">
                    © {new Date().getFullYear()} Auto Detailing AI. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

