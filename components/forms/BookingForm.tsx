/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:04:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"

interface BookingFormProps {
    organizationId: Id<"organizations">
    services: {
        _id: Id<"services">
        name: string
        duration: number
        price: number
    }[]
}

export default function BookingForm({ organizationId, services }: BookingFormProps) {
    const { toast } = useToast()
    const createBooking = useMutation(api.bookings.createBooking)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedService, setSelectedService] = useState<Id<"services"> | undefined>()
    const [startTime, setStartTime] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [customerEmail, setCustomerEmail] = useState<string>("")
    const [customerPhone, setCustomerPhone] = useState<string>("")

    const availableTimeSlots = useQuery(
        api.bookings.getAvailableTimeSlots,
        selectedDate && selectedService
            ? {
                organizationId,
                serviceId: selectedService,
                date: selectedDate.toISOString().split("T")[0],
            }
            : "skip",
    )

    useEffect(() => {
        if (availableTimeSlots && availableTimeSlots.length > 0) {
            setStartTime(availableTimeSlots[0])
        } else {
            setStartTime("")
        }
    }, [availableTimeSlots])

    const handleCreateBooking = async () => {
        if (!selectedDate || !selectedService || !startTime || !customerName || !customerEmail) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        try {
            await createBooking({
                organizationId,
                serviceId: selectedService,
                date: selectedDate.toISOString().split("T")[0],
                startTime,
                customerName,
                customerEmail,
                customerPhone,
            })
            toast({
                title: "Booking created",
                description: "The booking has been created successfully.",
            })
            // Reset form
            setSelectedDate(new Date())
            setSelectedService(undefined)
            setStartTime("")
            setCustomerName("")
            setCustomerEmail("")
            setCustomerPhone("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create booking. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Create Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                </div>
                <div className="space-y-4">
                    <Select onValueChange={(value) => setSelectedService(value as Id<"services">)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((service) => (
                                <SelectItem key={service._id} value={service._id}>
                                    {service.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setStartTime} value={startTime}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTimeSlots?.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                    {slot}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name"
                    />
                    <Input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Customer Email"
                    />
                    <Input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Customer Phone (optional)"
                    />
                    <Button onClick={handleCreateBooking}>Create Booking</Button>
                </div>
            </div>
        </div>
    )
}