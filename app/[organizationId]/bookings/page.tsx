/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:40:49
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { generateText } from "ai"
import { ollama } from 'ollama-ai-provider';
import { toast } from "@/hooks/use-toast"
import { Id } from "@/convex/_generated/dataModel"

interface Service {
    id: string
    name: string
    price: number
    duration: number
}

export default function BookingWizard() {
    const { organizationId } = useParams()
    const searchParams = useSearchParams()
    const [step, setStep] = useState(1)
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [availableSlots, setAvailableSlots] = useState<string[]>([])

    const id = localStorage.getItem("organizationId");
    const services = useQuery(api.services.getServices, { organizationId: id as Id<"organizations"> })
    const createBooking = useMutation(api.bookings.createBooking)

    useEffect(() => {
        const serviceId = searchParams.get("serviceId")
        if (serviceId) {
            setSelectedService(serviceId)
        }
    }, [searchParams])

    useEffect(() => {
        if (selectedService && selectedDate) {
            checkAvailability()
        }
    }, [selectedService, selectedDate])

    const checkAvailability = async () => {
        try {
            const selectedServiceData = services?.find((s) => s.id === selectedService)
            const { text } = await generateText({
                model: ollama ("llama3.1: 8b"),
                prompt: `Given the selected service: ${JSON.stringify(selectedServiceData)} and date: ${selectedDate?.toISOString()}, 
                 suggest available time slots for booking. Consider factors like business hours and existing appointments.
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
        }
    }

    const handleNextStep = () => {
        setStep(step + 1)
    }

    const handlePreviousStep = () => {
        setStep(step - 1)
    }

    const handleSubmit = async () => {
        try {
            await createBooking({
                organizationId: organizationId as string,
                serviceId: selectedService,
                date: new Date(`${selectedDate?.toISOString().split("T")[0]}T${selectedTime}`).toISOString(),
                customerName,
                customerEmail,
            })
            toast({
                title: "Booking Confirmed",
                description: "Your appointment has been successfully booked.",
            })
            // Redirect to confirmation page or dashboard
        } catch (error) {
            console.error("Error creating booking:", error)
            toast({
                title: "Error",
                description: "Failed to create booking. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Book Your Appointment</CardTitle>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <div className="space-y-4">
                        <Label htmlFor="service">Select Service</Label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services?.map((service: Service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name} - ${service.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleNextStep} disabled={!selectedService}>
                            Next
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <Label>Select Date</Label>
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                        <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot, index) => (
                                <Button
                                    key={index}
                                    variant={selectedTime === slot ? "default" : "outline"}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={handlePreviousStep}>Previous</Button>
                            <Button onClick={handleNextStep} disabled={!selectedDate || !selectedTime}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="customerName">Your Name</Label>
                            <Input
                                id="customerName"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="customerEmail">Your Email</Label>
                            <Input
                                id="customerEmail"
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={handlePreviousStep}>Previous</Button>
                            <Button onClick={handleSubmit} disabled={!customerName || !customerEmail}>
                                Confirm Booking
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

