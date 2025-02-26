/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 25/02/2025 - 09:22:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import React, { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCompletion } from "ai/react"
import { toast} from "@/hooks/use-toast"



interface Service {
    id: string
    name: string
    duration: number
}

export default function AIScheduleSuggestion() {
    const { organizationId } = useParams()
    const [selectedService, setSelectedService] = useState<string>("")
    const [aiSuggestion, setAiSuggestion] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const services = useQuery(api.services.listServices, { Id: organizationId as string })
    const predictOptimalSlots = useMutation(api.scheduling.predictOptimalSlots)

    const { complete } = useCompletion({
        api: "/api/ai/schedule-suggestion",
    })

    const handleGetSuggestion = async () => {
        if (!selectedService) {
            toast({
                title: "Error",
                description: "Please select a service first.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            const optimalSlots = await predictOptimalSlots({
                organizationId: organizationId as string,
                serviceId: selectedService,
            })

            const aiResponse = await complete(
                `Given the following optimal slots for the selected service: ${JSON.stringify(optimalSlots)}, suggest the best 3 time slots for scheduling this service in the next 7 days. Consider factors like business hours, existing appointments, and optimal time slots for the specific service.`,
            )

            setAiSuggestion(aiResponse)
        } catch (error) {
            console.error("Error getting AI suggestion:", error)
            toast({
                title: "Error",
                description: "Failed to get AI suggestion. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Schedule Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="service">Select Service</Label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services?.map((service: Service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGetSuggestion} disabled={isLoading}>
                        {isLoading ? "Getting Suggestions..." : "Get AI Suggestions"}
                    </Button>
                    {aiSuggestion && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">AI Suggestions:</h3>
                            <p className="whitespace-pre-line">{aiSuggestion}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

