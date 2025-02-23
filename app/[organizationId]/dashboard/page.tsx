/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:41:55
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
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface Booking {
    id: string
    serviceId: string
    serviceName: string
    date: string
    status: "upcoming" | "completed" | "cancelled"
}

export default function CustomerDashboard() {
    const { organizationId } = useParams()
    const [customerEmail, setCustomerEmail] = useState("")
    const [bookings, setBookings] = useState<Booking[]>([])

    const customerBookings = useQuery(api.bookings.getCustomerBookings, {
        organizationId: organizationId as string,
        customerEmail: customerEmail,
    })
    const cancelBooking = useMutation(api.bookings.cancelBooking)

    useEffect(() => {
        // In a real application, you would get the customer email from authentication
        // For this example, we'll use a hardcoded email
        setCustomerEmail("customer@example.com")
    }, [])

    useEffect(() => {
        if (customerBookings) {
            setBookings(customerBookings)
        }
    }, [customerBookings])

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await cancelBooking({
                organizationId: organizationId as string,
                bookingId: bookingId,
            })
            setBookings(bookings.filter((booking) => booking.id !== bookingId))
            toast({
                title: "Booking Cancelled",
                description: "Your appointment has been successfully cancelled.",
            })
        } catch (error) {
            console.error("Error cancelling booking:", error)
            toast({
                title: "Error",
                description: "Failed to cancel booking. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
                {bookings.length === 0 ? (
                    <p>You have no bookings at the moment.</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <CardTitle>{booking.serviceName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Date: {new Date(booking.date).toLocaleString()}</p>
                                    <p>Status: {booking.status}</p>
                                    {booking.status === "upcoming" && (
                                        <Button onClick={() => handleCancelBooking(booking.id)} variant="destructive" className="mt-2">
                                            Cancel Booking
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

