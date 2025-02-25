/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:15:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Service {
    id: string
    name: string
    duration: number
}

export default function BookingForm() {
    const { organizationId } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [customerEmail, setCustomerEmail] = useState<string>("")
    
    const [selectedCustomer, setSelectedCustomer] = useState<string>("")
    const [startTime, setStartTime] = useState<string>("")

    const servicesData = useQuery(api.services.getServices, { organizationId: organizationId as string })
    const createBooking = useMutation(api.bookings.createBooking)
    const sendNotificationEmail = useMutation(api.notifications.sendNotificationEmail)

    useEffect(() => {
        if (servicesData) {
            setServices(servicesData)
        }
        const serviceId = searchParams.get("serviceId")
        if (serviceId) {
            setSelectedService(serviceId)
        }
        const date = searchParams.get("date")
        if (date) {
            setSelectedDate(new Date(date))
        }
    }, [servicesData, searchParams])



    // Helper functions for input validation
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/
        return phoneRegex.test(phone)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const booking = await createBooking({
                organizationId: organizationId as string,
                serviceId: selectedService,
                date: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
                customerName,
                customerEmail,
            })

            // Send confirmation email
            await sendNotificationEmail({
                organizationId: organizationId as string,
                to: customerEmail,
                subject: "Booking Confirmation",
                templateType: "confirmation",
                templateData: {
                    customerName,
                    serviceName: services?.find((s) => s.id === selectedService)?.name || "",
                    date: selectedDate,
                    time: selectedTime,
                    businessName: "Auto Detailing AI", // Replace with actual business name
                    businessAddress: "123 Main St, City, State, ZIP", // Replace with actual address
                    businessPhone: "(123) 456-7890", // Replace with actual phone number
                },
            })

            toast({
                title: "Booking Confirmed",
                description: "Your appointment has been successfully booked. Check your email for confirmation.",
            })
            router.push(`/${organizationId}/booking/booking-confirmation/${booking.id}`)
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="service">Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                                {service.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    required
                />
            </div>
            <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="customerName">Name</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Book Appointment</Button>
        </form>
    )
}

