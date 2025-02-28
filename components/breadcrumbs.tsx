/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 10:02:59
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export function Breadcrumbs() {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                        Home
                    </Link>
                </li>
                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
                    const isLast = index === pathSegments.length - 1
                    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

                    return (
                        <li key={href} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            {isLast ? (
                                <span className="ml-2 text-gray-700">{label}</span>
                            ) : (
                                <Link href={href} className="ml-2 text-gray-500 hover:text-gray-700">
                                    {label}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}