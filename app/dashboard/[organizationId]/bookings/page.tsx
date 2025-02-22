/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 08:59:27
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import React from "react"
import { useOrganization } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { Id } from "@/convex/_generated/dataModel"
import ErrorBoundary from "@/components/ErrorBoundery"
import BookingForm from "@/components/forms/BookingForm"
import { useToast } from "@/hooks/use-toast"


export default function BookingsPage({ params }: { params: { organizationId: string } }) {
    const { organization } = useOrganization()
    const { toast } = useToast()
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())

    const bookings = useQuery(api.bookings.getBookingsByDate, {
        organizationId: params.organizationId as Id<"organizations">,
        date: selectedDate?.toISOString().split("T")[0] ?? "",
    })

    const cancelBooking = useMutation(api.bookings.cancelBooking)

    const handleCancelBooking = async (bookingId: Id<"bookings">) => {
        try {
            await cancelBooking({ bookingId })
            toast({
                title: "Booking cancelled",
                description: "The booking has been successfully cancelled.",
            })
        } catch (error) {
            console.error("Failed to create booking:", error);
            toast({
                title: "Error creating booking",
                description: "Failed to create booking. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!organization) {
        return <div>Loading...</div>
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <BookingForm organizationId={params.organizationId as Id<"organizations">} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bookings for {selectedDate?.toLocaleDateString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookings === undefined ? (
                                <div>Loading...</div>
                            ) : bookings.length > 0 ? (
                                <ul className="space-y-2">
                                    {bookings.map((booking) => (
                                        <li key={booking._id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{booking.serviceName}</p>
                                                <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span>{booking.startTime}</span>
                                                <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking._id)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No bookings for this date</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ErrorBoundary>
    )
}

