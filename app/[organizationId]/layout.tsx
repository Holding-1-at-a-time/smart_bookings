/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 21:35:38
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { organizationId } = useParams()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-primary text-primary-foreground sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/${organizationId}`} className="text-2xl font-bold">
            Auto Detailing AI
          </Link>
          <ul className="hidden md:flex space-x-4">
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
              <Link href={`/${organizationId}/chat`} className="hover:underline">
                Chat
              </Link>
            </li>
            <li>
              <Link href={`/${organizationId}/dashboard`} className="hover:underline">
                Dashboard
              </Link>
            </li>
          </ul>
          <MobileNavigation />
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-secondary text-secondary-foreground mt-auto">
        <div className="container mx-auto px-4 py-3 text-center">
          © {new Date().getFullYear()} Auto Detailing AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

