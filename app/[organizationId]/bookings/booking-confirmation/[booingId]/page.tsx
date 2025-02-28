/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 23:18:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Booking {
    _id: string
    serviceId: string
    serviceName: string
    date: string
    time: string
    customerName: string
    customerEmail: string
}

export default function BookingConfirmation({
    params,
}: {
    params: { organizationId: string; bookingId: string }
}) {
    const [booking, setBooking] = useState<Booking | null>(null)

    const bookingData = useQuery(api.bookings.getBooking, {
        organizationId: params.organizationId,
        bookingId: params.bookingId,
    })

    useEffect(() => {
        if (bookingData) {
            setBooking(bookingData)
        }
    }, [bookingData])

    if (!booking) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Confirmation</CardTitle>
                    <CardDescription>Loading booking details...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </CardContent>
            </Card>
        )
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
                        <strong>Time:</strong> {booking.time}
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

