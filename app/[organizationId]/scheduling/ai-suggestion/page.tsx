/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:15:13
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { toast } from "@/hooks/use-toast"

interface Service {
    id: string
    name: string
    duration: number
}

interface Appointment {
    id: string
    date: string
    serviceId: string
}

export default function AIScheduleSuggestion() {
    const { organizationId } = useParams()
    const [selectedService, setSelectedService] = useState<string>("")
    const [aiSuggestion, setAiSuggestion] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const services = useQuery(api.services.getServices, { organizationId: organizationId as string })
    const appointments = useQuery(api.appointments.getAppointments, { organizationId: organizationId as string })
    const scheduleAppointment = useMutation(api.appointments.scheduleAppointment)

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
            const selectedServiceData = services?.find((s) => s.id === selectedService)
            const { text } = await generateText({
                model: openai("gpt-4o"),
                prompt: `Given the following appointments: ${JSON.stringify(appointments)}, 
                 and the selected service: ${JSON.stringify(selectedServiceData)}, 
                 suggest the best 3 time slots for scheduling this service in the next 7 days. 
                 Consider factors like business hours, existing appointments, and optimal time slots for the specific service.`,
            })
            setAiSuggestion(text)
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

    const handleScheduleAppointment = async (suggestedTime: string) => {
        try {
            await scheduleAppointment({
                organizationId: organizationId as string,
                serviceId: selectedService,
                date: new Date(suggestedTime).toISOString(),
            })
            toast({
                title: "Success",
                description: "Appointment scheduled successfully.",
            })
        } catch (error) {
            console.error("Error scheduling appointment:", error)
            toast({
                title: "Error",
                description: "Failed to schedule appointment. Please try again.",
                variant: "destructive",
            })
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
                            <div className="mt-4">
                                <h4 className="text-md font-semibold mb-2">Schedule an appointment:</h4>
                                {aiSuggestion.split("\n").map((suggestion, index) => (
                                    <Button key={index} onClick={() => handleScheduleAppointment(suggestion)} className="mr-2 mb-2">
                                        Schedule for {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

