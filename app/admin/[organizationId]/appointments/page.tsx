/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 14:48:09
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Appointment {
    id: string
    customerName: string
    serviceName: string
    date: string
    status: "scheduled" | "completed" | "cancelled"
}

export default function AppointmentManagement() {
    const { organizationId } = useParams()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    const appointmentsData = useQuery(api.admin.getAppointments, { organizationId: organizationId as string })
    const updateAppointment = useMutation(api.admin.updateAppointment)

    useEffect(() => {
        if (appointmentsData) {
            setAppointments(appointmentsData)
        }
    }, [appointmentsData])

    const handleStatusChange = async (appointmentId: string, newStatus: "scheduled" | "completed" | "cancelled") => {
        try {
            await updateAppointment({
                organizationId: organizationId as string,
                appointmentId: appointmentId,
                status: newStatus,
            })
            setAppointments(appointments.map((app) => (app.id === appointmentId ? { ...app, status: newStatus } : app)))
            toast({
                title: "Appointment Updated",
                description: `Appointment status changed to ${newStatus}.`,
            })
        } catch (error) {
            console.error("Error updating appointment:", error)
            toast({
                title: "Error",
                description: "Failed to update appointment. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Appointment Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment.customerName}</TableCell>
                                    <TableCell>{appointment.serviceName}</TableCell>
                                    <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={() => setSelectedAppointment(appointment)}>
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Appointment</DialogTitle>
                                                </DialogHeader>
                                                {selectedAppointment && (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="customerName">Customer Name</Label>
                                                            <Input id="customerName" value={selectedAppointment.customerName} readOnly />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="serviceName">Service</Label>
                                                            <Input id="serviceName" value={selectedAppointment.serviceName} readOnly />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="date">Date</Label>
                                                            <Input id="date" value={new Date(selectedAppointment.date).toLocaleString()} readOnly />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="status">Status</Label>
                                                            <select
                                                                id="status"
                                                                value={selectedAppointment.status}
                                                                onChange={(e) =>
                                                                    handleStatusChange(
                                                                        selectedAppointment.id,
                                                                        e.target.value as "scheduled" | "completed" | "cancelled",
                                                                    )
                                                                }
                                                                className="w-full p-2 border rounded"
                                                            >
                                                                <option value="scheduled">Scheduled</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

