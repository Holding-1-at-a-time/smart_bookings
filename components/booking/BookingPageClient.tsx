/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 11:30:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import React from "react"
import { usePreloadedQuery, type Preloaded } from "convex/nextjs"
import type { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/ErrorBoundary"
import BookingForm from "./components/BookingForm"

interface BookingsPageClientProps {
    organizationId: Id<"organizations">
    preloadedBookings: Preloaded<typeof api.bookings.getBookingsByDate>
    preloadedServices: Preloaded<typeof api.services.listServices>
}

export default function BookingsPageClient({
    organizationId,
    preloadedBookings,
    preloadedServices,
}: BookingsPageClientProps) {
    const { toast } = useToast()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const bookings = usePreloadedQuery(preloadedBookings)
    const services = usePreloadedQuery(preloadedServices)

    const handleCancelBooking = async (bookingId: Id<"bookings">) => {
        try {
            // We'll implement this mutation later
            // await cancelBooking({ bookingId })
            toast({
                title: "Booking cancelled",
                description: "The booking has been successfully cancelled.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel the booking. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <BookingForm organizationId={organizationId} services={services} />
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
                            {bookings.length > 0 ? (
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