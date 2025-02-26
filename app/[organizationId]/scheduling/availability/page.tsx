/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 25/02/2025 - 05:05:16
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/02/2025
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"

interface Service {
  id: string
  name: string
  duration: number
}

export default function AvailabilityChecker() {
  const { organizationId } = useParams()
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const services = useQuery(api.services.listServices, { organizationId: organizationId as string })
  const getAvailableSlots = useMutation(api.scheduling.getAvailableSlots)

  useEffect(() => {
    if (selectedService && selectedDate) {
      checkAvailability()
    }
  }, [selectedService, selectedDate])

  const checkAvailability = async () => {
    if (!selectedService || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select a service and date.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const slots = await getAvailableSlots({
        organizationId: organizationId as string,
        serviceId: selectedService,
        date: selectedDate.toISOString().split("T")[0],
      })
      setAvailableSlots(slots)
    } catch (error) {
      console.error("Error checking availability:", error)
      toast({
        title: "Error",
        description: "Failed to check availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service">Select Service</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service: Service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Select Date</Label>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </div>
          <Button onClick={checkAvailability} disabled={isLoading}>
            {isLoading ? "Checking Availability..." : "Check Availability"}
          </Button>
          {availableSlots.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Available Slots:</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot, index) => (
                  <Button key={index} variant="outline">
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

