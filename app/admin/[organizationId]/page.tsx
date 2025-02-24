/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:47:12
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
import { generateText } from "ai"
import { ollama } from 'ollama-ai-provider';

interface OverviewData {
    totalAppointments: number
    totalRevenue: number
    topServices: { name: string; count: number }[]
}

export default function AdminOverview() {
    const { organizationId } = useParams()
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
    const [aiInsight, setAiInsight] = useState<string>("")

    const data = useQuery(api.admin.getOverviewData, { organizationId: organizationId as string })

    useEffect(() => {
        if (data) {
            setOverviewData(data)
            generateAIInsight(data)
        }
    }, [data])

    const generateAIInsight = async (data: OverviewData) => {
        try {
            const { text } = await generateText({
                model: ollama("llama3.1: 8b"),
                prompt: `Given the following overview data for an auto detailing business:
                 Total Appointments: ${data.totalAppointments}
                 Total Revenue: $${data.totalRevenue}
                 Top Services: ${JSON.stringify(data.topServices)}
                 
                 Provide a brief business insight and recommendation based on this data.`,
            })
            setAiInsight(text)
        } catch (error) {
            console.error("Error generating AI insight:", error)
            toast({
                title: "Error",
                description: "Failed to generate AI insight.",
                variant: "destructive",
            })
            setAiInsight("Unable to generate AI insight at this time.")
        }
    }

    if (!overviewData) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{overviewData.totalAppointments}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${overviewData.totalRevenue.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {overviewData.topServices.map((service, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{service.name}</span>
                                    <span>{service.count}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>AI Business Insight</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{aiInsight}</p>
                </CardContent>
            </Card>
        </div>
    )
}

