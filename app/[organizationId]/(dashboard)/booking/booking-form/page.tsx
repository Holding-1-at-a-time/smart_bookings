/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:53:41
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
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [customerEmail, setCustomerEmail] = useState<string>("")

    const servicesData = useQuery(api.services.getServices, { organizationId: organizationId as string })
    const createBooking = useMutation(api.bookings.createBooking)

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
            setSelectedDate(new Date(date).toISOString().split("T")[0])
        }
    }, [servicesData, searchParams])

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
            toast({
                title: "Booking created",
                description: "Your appointment has been successfully booked.",
            })
            router.push(`/${organizationId}/booking/booking-confirmation/${booking.id}`)
        } catch (error) {
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
                <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
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

