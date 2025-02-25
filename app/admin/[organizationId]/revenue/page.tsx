/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:17:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { auth } from "@clerk/nextjs"

interface RevenueData {
    date: string
    revenue: number
}

export default function RevenueAnalytics() {
    const { userId } = auth()
    const { organizationId } = useParams()
    const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week")
    const [revenueData, setRevenueData] = useState<RevenueData[]>([])

    if (!userId) {
        return <div>Unauthorized</div>
    }

    const data = useQuery(api.admin.getRevenueData, {
        organizationId: organizationId as string,
        timeFrame: timeFrame,
    })

    useEffect(() => {
        if (data) {
            setRevenueData(data)
        }
    }, [data])

    const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0)
    const averageRevenue = totalRevenue / revenueData.length

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Revenue Analytics</h1>
            <div className="flex justify-between items-center">
                <Select value={timeFrame} onValueChange={(value: "week" | "month" | "year") => setTimeFrame(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Average Daily Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${averageRevenue.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

