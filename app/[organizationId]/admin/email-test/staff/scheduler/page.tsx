/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:33:17
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"

interface Staff {
    id: string
    name: string
}

interface Shift {
    id: string
    staffId: string
    date: string
    startTime: string
    endTime: string
}

export default function StaffScheduler() {
    const { organizationId } = useParams()
    const [selectedStaff, setSelectedStaff] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [shifts, setShifts] = useState<Shift[]>([])

    const staffMembers = useQuery(api.staff.getStaffMembers, { organizationId: organizationId as string })
    const staffShifts = useQuery(api.staff.getStaffShifts, {
        organizationId: organizationId as string,
        staffId: selectedStaff,
        date: selectedDate?.toISOString().split("T")[0],
    })
    const createShift = useMutation(api.staff.createShift)
    const deleteShift = useMutation(api.staff.deleteShift)

    useEffect(() => {
        if (staffShifts) {
            setShifts(staffShifts)
        }
    }, [staffShifts])

    const handleCreateShift = async (startTime: string, endTime: string) => {
        if (!selectedStaff || !selectedDate) {
            toast({
                title: "Error",
                description: "Please select a staff member and date.",
                variant: "destructive",
            })
            return
        }

        try {
            await createShift({
                organizationId: organizationId as string,
                staffId: selectedStaff,
                date: selectedDate.toISOString().split("T")[0],
                startTime,
                endTime,
            })
            toast({
                title: "Success",
                description: "Shift created successfully.",
            })
        } catch (error) {
            console.error("Error creating shift:", error)
            toast({
                title: "Error",
                description: "Failed to create shift. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteShift = async (shiftId: string) => {
        try {
            await deleteShift({
                organizationId: organizationId as string,
                shiftId,
            })
            toast({
                title: "Success",
                description: "Shift deleted successfully.",
            })
        } catch (error) {
            console.error("Error deleting shift:", error)
            toast({
                title: "Error",
                description: "Failed to delete shift. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Staff Scheduler</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Schedule Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffMembers?.map((staff: Staff) => (
                                        <SelectItem key={staff.id} value={staff.id}>
                                            {staff.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => handleCreateShift("09:00", "17:00")}>Add Day Shift</Button>
                            <Button onClick={() => handleCreateShift("17:00", "01:00")}>Add Night Shift</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {shifts.map((shift) => (
                            <div key={shift.id} className="flex justify-between items-center p-2 border rounded">
                                <span>
                                    {shift.startTime} - {shift.endTime}
                                </span>
                                <Button variant="destructive" onClick={() => handleDeleteShift(shift.id)}>
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

