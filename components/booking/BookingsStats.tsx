/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 11:38:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingStatsProps {
    organizationId: Id<"organizations">
}

export default function BookingStats({ organizationId }: BookingStatsProps) {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
    })

    const stats = useQuery(api.bookings.getBookingStats, {
        organizationId,
        startDate: dateRange.from.toISOString().split("T")[0],
        endDate: dateRange.to.toISOString().split("T")[0],
    })

    if (!stats) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Statistics</CardTitle>
                <DateRangePicker value={dateRange} onValueChange={setDateRange} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Total Bookings</h3>
                        <p className="text-3xl font-bold">{stats.totalBookings}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Total Revenue</h3>
                        <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Status Breakdown</h3>
                        <ul>
                            {Object.entries(stats.statusCounts).map(([status, count]) => (
                                <li key={status} className="flex justify-between">
                                    <span>{status}</span>
                                    <span>{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

