/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:12:35
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function SettingsLayout({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
            <Tabs defaultValue="business-setup" className="mb-6">
                <TabsList>
                    <TabsTrigger value="business-setup" onClick={() => router.push("business-setup")}>
                        Business Setup
                    </TabsTrigger>
                    <TabsTrigger value="service-configuration" onClick={() => router.push("service-configuration")}>
                        Service Configuration
                    </TabsTrigger>
                    <TabsTrigger value="schedule-configuration" onClick={() => router.push("schedule-configuration")}>
                        Schedule Configuration
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {children}
        </div>
    )
}

