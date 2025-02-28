/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 22:05:07
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function BookingFormPage({
    params,
}: {
    params: { organizationId: string }
}) {
    const { toast } = useToast()
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [selectedService, setSelectedService] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const services = useQuery(api.services.list, { organizationId: params.organizationId })
    const availableDates = useQuery(api.bookings.getAvailableDates, { organizationId: params.organizationId })
    const availableTimes = useQuery(api.bookings.getAvailableTimes, {
        organizationId: params.organizationId,
        date: selectedDate,
        serviceId: selectedService,
    })
    const createBooking = useMutation(api.bookings.create)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const booking = await createBooking({
                organizationId: params.organizationId,
                name,
                email,
                phone,
                serviceId: selectedService,
                date: selectedDate,
                time: selectedTime,
            })
            toast({
                title: "Booking Successful",
                description: "Your appointment has been booked.",
            })
            router.push(`/${params.organizationId}/booking/booking-confirmation/${booking._id}`)
        } catch (error) {
            toast({
                title: "Booking Failed",
                description: "There was an error booking your appointment.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!services || !availableDates) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Book an Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-[100px]" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger id="service">
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service._id} value={service._id}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger id="date">
                                <SelectValue placeholder="Select a date" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDates.map((date) => (
                                    <SelectItem key={date} value={date}>
                                        {new Date(date).toLocaleDateString()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedDate && selectedService && (
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger id="time">
                                    <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTimes?.map((time) => (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Booking..." : "Book Appointment"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

