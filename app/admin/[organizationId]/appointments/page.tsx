/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 27/02/2025 - 23:19:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 27/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface Appointment {
    _id: string
    customerName: string
    serviceName: string
    date: string
    time: string
    status: "scheduled" | "completed" | "cancelled"
}

export default function AppointmentManagement({
    params,
}: {
    params: { organizationId: string }
}) {
    const { toast } = useToast()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

    const appointmentsData = useQuery(api.admin.getAppointments, { organizationId: params.organizationId })
    const updateAppointment = useMutation(api.admin.updateAppointment)

    useEffect(() => {
        if (appointmentsData) {
            setAppointments(appointmentsData)
        }
    }, [appointmentsData])

    const handleStatusChange = async (appointmentId: string, newStatus: "scheduled" | "completed" | "cancelled") => {
        try {
            await updateAppointment({
                organizationId: params.organizationId,
                appointmentId: appointmentId,
                status: newStatus,
            })
            setAppointments(appointments.map((app) => (app._id === appointmentId ? { ...app, status: newStatus } : app)))
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

    if (!appointmentsData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-4" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        )
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
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment._id}>
                                    <TableCell>{appointment.customerName}</TableCell>
                                    <TableCell>{appointment.serviceName}</TableCell>
                                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{appointment.time}</TableCell>
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
                                                            <Input
                                                                id="date"
                                                                value={new Date(selectedAppointment.date).toLocaleDateString()}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="time">Time</Label>
                                                            <Input id="time" value={selectedAppointment.time} readOnly />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="status">Status</Label>
                                                            <Select
                                                                value={selectedAppointment.status}
                                                                onValueChange={(value) =>
                                                                    handleStatusChange(
                                                                        selectedAppointment._id,
                                                                        value as "scheduled" | "completed" | "cancelled",
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger id="status">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
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

