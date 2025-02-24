/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:35:31
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Appointment {
    id: string
    date: string
    serviceName: string
    status: "scheduled" | "completed" | "cancelled"
}

export default function AppointmentHistory() {
    const { organizationId, customerId } = useParams()
    const [appointments, setAppointments] = useState<Appointment[]>([])

    const appointmentHistory = useQuery(api.customers.getAppointmentHistory, {
        organizationId: organizationId as string,
        customerId: customerId as string,
    })

    useEffect(() => {
        if (appointmentHistory) {
            setAppointments(appointmentHistory)
        }
    }, [appointmentHistory])

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Appointment History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{appointment.serviceName}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

