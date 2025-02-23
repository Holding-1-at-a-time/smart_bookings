/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:46:59
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

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { organizationId } = useParams()

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-6">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link href={`/admin/${organizationId}`} className="block py-2 px-4 hover:bg-gray-700 rounded">
                                Overview
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/${organizationId}/revenue`} className="block py-2 px-4 hover:bg-gray-700 rounded">
                                Revenue Analytics
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/admin/${organizationId}/appointments`}
                                className="block py-2 px-4 hover:bg-gray-700 rounded"
                            >
                                Appointment Management
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-8">{children}</main>
        </div>
    )
}

