/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 21/02/2025 - 07:55:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface AvailabilityManagerProps {
    organizationId: Id<"organizations">
}

export default function AvailabilityManager({ organizationId }: AvailabilityManagerProps) {
    const { toast } = useToast()
    const availability = useQuery(api.availability.getAvailability, { organizationId })
    const updateAvailability = useMutation(api.availability.updateAvailability)

    const [selectedDay, setSelectedDay] = useState<number>(0)
    const [startTime, setStartTime] = useState<string>("09:00")
    const [endTime, setEndTime] = useState<string>("17:00")

    const handleUpdateAvailability = async () => {
        if (startTime >= endTime) {
            toast({
                title: "Invalid time range",
                description: "End time must be after start time",
                variant: "destructive",
            })
            return
        }
        try {
            await updateAvailability({
                organizationId,
                dayOfWeek: selectedDay,
                startTime,
                endTime,
            })
            toast({
                title: "Availability updated",
                description: "The availability has been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update availability. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (availability === undefined) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Manage Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select onValueChange={(value) => setSelectedDay(Number.parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                        {daysOfWeek.map((day, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {day}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time" />
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time" />
            </div>
            <Button onClick={handleUpdateAvailability}>Update Availability</Button>
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Current Availability</h3>
                <ul className="space-y-2">
                    {availability.map((slot) => (
                        <li key={slot._id} className="flex justify-between items-center">
                            <span>{daysOfWeek[slot.dayOfWeek]}</span>
                            <span>
                                {slot.startTime} - {slot.endTime}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

