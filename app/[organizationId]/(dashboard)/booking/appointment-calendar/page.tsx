/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:52:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateText } from "ai"
import { ollama } from 'ollama-ai-provider';

interface Appointment {
    id: string
    date: Date
    serviceId: string
    serviceName: string
}

export default function AppointmentCalendar() {
    const { organizationId } = useParams()
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [aiSuggestion, setAiSuggestion] = useState<string>("")

    const appointmentsData = useQuery(api.appointments.getAppointments, {
        organizationId: organizationId as string,
        month: selectedDate?.getMonth() ?? new Date().getMonth(),
        year: selectedDate?.getFullYear() ?? new Date().getFullYear(),
    })

    useEffect(() => {
        if (appointmentsData) {
            setAppointments(appointmentsData)
        }
    }, [appointmentsData])

    useEffect(() => {
        if (selectedDate) {
            getAISuggestion(selectedDate)
        }
    }, [selectedDate])

    const getAISuggestion = async (date: Date) => {
        try {
            const { text } = await generateText({
                model: openai("llama3.1: 8b"),
                prompt: `Suggest an optimal appointment time on ${date.toDateString()} based on the current appointments: ${JSON.stringify(appointments)}. Consider factors like peak hours and available slots.`,
            })
            setAiSuggestion(text)
        } catch (error) {
            console.error("Error getting AI suggestion:", error)
            setAiSuggestion("Unable to get AI suggestion at this time.")
        }
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    const handleBookAppointment = () => {
        if (selectedDate) {
            router.push(`/${organizationId}/booking/booking-form?date=${selectedDate.toISOString()}`)
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} className="rounded-md border" />
            </div>
            <div className="flex-1">
                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-bold mb-4">Appointments for {selectedDate?.toDateString()}</h2>
                        {appointments
                            .filter((app) => new Date(app.date).toDateString() === selectedDate?.toDateString())
                            .map((app) => (
                                <div key={app.id} className="mb-2">
                                    <p>
                                        {new Date(app.date).toLocaleTimeString()} - {app.serviceName}
                                    </p>
                                </div>
                            ))}
                        {aiSuggestion && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">AI Suggestion</h3>
                                <p>{aiSuggestion}</p>
                            </div>
                        )}
                        <Button onClick={handleBookAppointment} className="mt-4">
                            Book Appointment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

