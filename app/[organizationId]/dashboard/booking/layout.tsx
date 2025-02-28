/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:51:46
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

export default function BookingLayout({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
            <Tabs defaultValue="service-catalog" className="mb-6">
                <TabsList>
                    <TabsTrigger value="service-catalog" onClick={() => router.push("service-catalog")}>
                        Services
                    </TabsTrigger>
                    <TabsTrigger value="appointment-calendar" onClick={() => router.push("appointment-calendar")}>
                        Calendar
                    </TabsTrigger>
                    <TabsTrigger value="booking-form" onClick={() => router.push("booking-form")}>
                        Book Now
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {children}
        </div>
    )
}

