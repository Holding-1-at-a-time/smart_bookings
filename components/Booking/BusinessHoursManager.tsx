/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:18:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { useQuery, useMutation } from "convex/react"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "react-day-picker"
import { Input } from "../ui/input"


interface BusinessHoursManagerProps {
    organizationId: Id<"organizations">
}

export default function BusinessHoursManager({ organizationId }: BusinessHoursManagerProps) {
    const { toast } = useToast()
    const organization = useQuery(api.organizations.getOrganizationSettings, { organizationId })
    const updateBusinessHours = useMutation(api.organizations.updateBusinessHours)

    const [businessHours, setBusinessHours] = useState<Array<{ dayOfWeek: number; start: string; end: string }>>([])

    useEffect(() => {
        if (organization) {
            setBusinessHours(organization.businessHours)
        }
    }, [organization])

    const handleUpdateHours = (index: number, field: "start" | "end", value: string) => {
        const updatedHours = [...businessHours]
        updatedHours[index] = { ...updatedHours[index], [field]: value }
        setBusinessHours(updatedHours)
    }

    const handleSave = async () => {
        try {
            await updateBusinessHours({ organizationId, businessHours })
            toast({
                title: "Business hours updated",
                description: "Your business hours have been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update business hours. Please try again.",
                variant: "destructive",
            })
        }
    }

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface BusinessHoursManagerProps {
    organizationId: Id<"organizations">
}

export default function BusinessHoursManager({ organizationId }: BusinessHoursManagerProps) {
    const { toast } = useToast()
    const businessHours = useQuery(api.organizationSettings.getBusinessHours, { organizationId })
    const updateBusinessHours = useMutation(api.organizationSettings.updateBusinessHours)
    const holidays = useQuery(api.organizationSettings.getHolidays, { organizationId })
    const addHoliday = useMutation(api.organizationSettings.addHoliday)
    const removeHoliday = useMutation(api.organizationSettings.removeHoliday)

    const [selectedDay, setSelectedDay] = useState<number>(0)
    const [startTime, setStartTime] = useState<string>("09:00")
    const [endTime, setEndTime] = useState<string>("17:00")
    const [holidayDate, setHolidayDate] = useState<Date | undefined>()
    const [holidayName, setHolidayName] = useState<string>("")

    useEffect(() => {
        if (businessHours) {
            const dayHours = businessHours.find((hours) => hours.dayOfWeek === selectedDay)
            if (dayHours) {
                setStartTime(dayHours.start)
                setEndTime(dayHours.end)
            }
        }
    }, [businessHours, selectedDay])

    const handleUpdateBusinessHours = async () => {
        try {
            const updatedHours = businessHours?.map((hours) =>
                hours.dayOfWeek === selectedDay ? { ...hours, start: startTime, end: endTime } : hours,
            )
            await updateBusinessHours({ organizationId, businessHours: updatedHours || [] })
            toast({
                title: "Business hours updated",
                description: "The business hours have been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update business hours. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleAddHoliday = async () => {
        if (!holidayDate || !holidayName) {
            toast({
                title: "Error",
                description: "Please select a date and enter a name for the holiday.",
                variant: "destructive",
            })
            return
        }

        try {
            await addHoliday({
                organizationId,
                date: holidayDate.toISOString().split("T")[0],
                name: holidayName,
            })
            toast({
                title: "Holiday added",
                description: "The holiday has been added successfully.",
            })
            setHolidayDate(undefined)
            setHolidayName("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add holiday. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleRemoveHoliday = async (date: string) => {
        try {
            await removeHoliday({ organizationId, date })
            toast({
                title: "Holiday removed",
                description: "The holiday has been removed successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove holiday. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select onValueChange={(value) => setSelectedDay(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <Button onClick={handleUpdateBusinessHours} className="mt-4">
                    Update Business Hours
                </Button>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Holidays</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Calendar mode="single" selected={holidayDate} onSelect={setHolidayDate} className="rounded-md border" />
                    </div>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                            placeholder="Holiday Name"
                        />
                        <Button onClick={handleAddHoliday}>Add Holiday</Button>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Current Holidays</h3>
                    <ul className="space-y-2">
                        {holidays?.map((holiday) => (
                            <li key={holiday.date} className="flex justify-between items-center">
                                <span>
                                    {holiday.date} - {holiday.name}
                                </span>
                                <Button variant="destructive" size="sm" onClick={() => handleRemoveHoliday(holiday.date)}>
                                    Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

