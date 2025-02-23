/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:14:19
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

export default function SchedulingLayout({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">AI-Powered Scheduling</h1>
            <Tabs defaultValue="ai-suggestion" className="mb-6">
                <TabsList>
                    <TabsTrigger value="ai-suggestion" onClick={() => router.push("ai-suggestion")}>
                        AI Schedule Suggestion
                    </TabsTrigger>
                    <TabsTrigger value="availability" onClick={() => router.push("availability")}>
                        Dynamic Availability
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {children}
        </div>
    )
}

