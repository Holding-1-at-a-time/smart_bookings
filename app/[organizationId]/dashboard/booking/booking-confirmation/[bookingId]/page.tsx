/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:54:39
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Booking {
    id: string
    serviceId: string
    serviceName: string
    date: string
    customerName: string
    customerEmail: string
}

export default function BookingConfirmation() {
    const { organizationId, bookingId } = useParams()
    const [booking, setBooking] = useState<Booking | null>(null)

    const bookingData = useQuery(api.bookings.getBooking, {
        organizationId: organizationId as string,
        bookingId: bookingId as string,
    })

    useEffect(() => {
        if (bookingData) {
            setBooking(bookingData)
        }
    }, [bookingData])

    if (!booking) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Confirmation</CardTitle>
                <CardDescription>Your appointment has been successfully booked.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p>
                        <strong>Service:</strong> {booking.serviceName}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}
                    </p>
                    <p>
                        <strong>Name:</strong> {booking.customerName}
                    </p>
                    <p>
                        <strong>Email:</strong> {booking.customerEmail}
                    </p>
                </div>
                <Button className="mt-4" onClick={() => window.print()}>
                    Print Confirmation
                </Button>
            </CardContent>
        </Card>
    )
}

