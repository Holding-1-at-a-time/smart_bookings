/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 13:35:51
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"


const AvailabilityManager = () => {
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [availability, setAvailability] = useState<string | null>(null)

    const handleUpdateAvailability = async () => {
        if (startTime >= endTime) {
            toast({
                title: "Invalid time range",
                description: "End time must be after start time",
                variant: "destructive",
            })
            return
        }

        setAvailability(`Available from ${startTime} to ${endTime}`)
        toast({
            title: "Availability Updated",
            description: `Availability set from ${startTime} to ${endTime}`,
        })
    }

    return (
        <Card className="w-[380px]">
            <CardHeader>
                <CardTitle>Availability Manager</CardTitle>
                <CardDescription>Set your availability for appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            placeholder="e.g., 9:00 AM"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                            id="endTime"
                            placeholder="e.g., 5:00 PM"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                {availability && <p>{availability}</p>}
                <Button onClick={handleUpdateAvailability}>Update Availability</Button>
            </CardFooter>
        </Card>
    )
}

export default AvailabilityManager

