/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:15:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { generateText } from "ai"
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

export default function DynamicAvailabilityChecker() {
    const { organizationId } = useParams()
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const services = useQuery(api.services.getServices, { organizationId: organizationId as string })
    const appointments = useQuery(api.appointments.getAppointments, {
        organizationId: organizationId as string,
        date: selectedDate?.toISOString().split("T")[0],
    })
    const businessHours = useQuery(api.schedules.getBusinessHours, { organizationId: organizationId as string })

    useEffect(() => {
        if (selectedService && selectedDate) {
            checkAvailability()
        }
    }, [selectedService, selectedDate, checkAvailability])

    const checkAvailability = useCallback(async () => {
        if (!selectedService || !selectedDate) {
            toast({
                title: "Error",
                description: "Please select a service and date.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            const selectedServiceData = services?.find((s) => s.id === selectedService)
            const { text } = await generateText({
                model: open("gpt-4o"),
                prompt: `Given the following data:
                 - Business hours: ${JSON.stringify(businessHours)}
                 - Existing appointments: ${JSON.stringify(appointments)}
                 - Selected service: ${JSON.stringify(selectedServiceData)}
                 - Selected date: ${selectedDate.toISOString()}
                 
                 Determine the available time slots for scheduling this service on the selected date.
                 Consider factors like business hours, existing appointments, and the duration of the selected service.
                 Return the result as a JSON array of available time slots in HH:MM format.`,
            })
            const availableTimesArray = JSON.parse(text)
            setAvailableSlots(availableTimesArray)
        } catch (error) {
            console.error("Error checking availability:", error)
            toast({
                title: "Error",
                description: "Failed to check availability. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dynamic Availability Checker</CardTitle>
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
                    <div>
                        <Label>Select Date</Label>
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                    </div>
                    <Button onClick={checkAvailability} disabled={isLoading}>
                        {isLoading ? "Checking Availability..." : "Check Availability"}
                    </Button>
                    {availableSlots.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Available Slots:</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {availableSlots.map((slot, index) => (
                                    <Button key={index} variant="outline">
                                        {slot}
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

