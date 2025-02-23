/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 13:34:23
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/app/smart_bookings/components/ui/switch"
import { toast } from "@/hooks/use-toast"


interface BusinessHours {
    [day: string]: { open: string; close: string; isOpen: boolean }
}

interface Holiday {
    id: string
    date: string
    name: string
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function ScheduleConfiguration() {
    const { organizationId } = useParams()
    const [businessHours, setBusinessHours] = useState<BusinessHours>({})
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [newHoliday, setNewHoliday] = useState({ date: "", name: "" })

    const existingSchedule = useQuery(api.schedules.getSchedule, { organizationId: organizationId as string })
    const updateSchedule = useMutation(api.schedules.updateSchedule)
    const addHoliday = useMutation(api.schedules.addHoliday)
    const deleteHoliday = useMutation(api.schedules.deleteHoliday)

    useEffect(() => {
        if (existingSchedule) {
            setBusinessHours(existingSchedule.businessHours)
            setHolidays(existingSchedule.holidays)
        }
    }, [existingSchedule])

    const handleBusinessHoursChange = (day: string, field: "open" | "close" | "isOpen", value: string | boolean) => {
        setBusinessHours((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }))
    }

    const handleSaveSchedule = async () => {
        try {
            await updateSchedule({
                organizationId: organizationId as string,
                businessHours,
                holidays,
            })
            toast({
                title: "Schedule updated",
                description: "Your business schedule has been successfully saved.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update schedule. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleAddHoliday = async () => {
        try {
            const addedHoliday = await addHoliday({
                organizationId: organizationId as string,
                ...newHoliday,
            })
            setHolidays([...holidays, { ...newHoliday, id: addedHoliday.id }])
            setNewHoliday({ date: "", name: "" })
            toast({
                title: "Holiday added",
                description: "New holiday has been successfully added.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add new holiday. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteHoliday = async (id: string) => {
        try {
            await deleteHoliday({ id, organizationId: organizationId as string })
            setHolidays(holidays.filter((h) => h.id !== id))
            toast({
                title: "Holiday deleted",
                description: "Holiday has been successfully deleted.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete holiday. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Schedule Configuration</h2>

            {/* Business Hours */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Business Hours</h3>
                {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                        <Label className="w-24">{day}</Label>
                        <Switch
                            checked={businessHours[day]?.isOpen}
                            onCheckedChange={(checked) => handleBusinessHoursChange(day, "isOpen", checked)}
                        />
                        {businessHours[day]?.isOpen && (
                            <>
                                <Input
                                    type="time"
                                    value={businessHours[day]?.open}
                                    onChange={(e) => handleBusinessHoursChange(day, "open", e.target.value)}
                                    className="w-32"
                                />
                                <span>to</span>
                                <Input
                                    type="time"
                                    value={businessHours[day]?.close}
                                    onChange={(e) => handleBusinessHoursChange(day, "close", e.target.value)}
                                    className="w-32"
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Holidays */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Holidays</h3>
                <div className="flex space-x-4">
                    <Input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        className="w-40"
                    />
                    <Input
                        placeholder="Holiday Name"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    />
                    <Button onClick={handleAddHoliday}>Add Holiday</Button>
                </div>
                {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center space-x-4">
                        <Input
                            type="date"
                            value={holiday.date}
                            onChange={(e) => {
                                const updatedHolidays = holidays.map((h) => (h.id === holiday.id ? { ...h, date: e.target.value } : h))
                                setHolidays(updatedHolidays)
                            }}
                            className="w-40"
                        />
                        <Input
                            value={holiday.name}
                            onChange={(e) => {
                                const updatedHolidays = holidays.map((h) => (h.id === holiday.id ? { ...h, name: e.target.value } : h))
                                setHolidays(updatedHolidays)
                            }}
                        />
                        <Button variant="destructive" onClick={() => handleDeleteHoliday(holiday.id)}>
                            Delete
                        </Button>
                    </div>
                ))}
            </div>

            <Button onClick={handleSaveSchedule}>Save Schedule</Button>
        </div>
    )
}

