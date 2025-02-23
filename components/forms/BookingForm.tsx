/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:04:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { v } from "convex/values"
import { mutation } from "@/convex/_generated/server"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
    organizationId: Id<"organizations">
    services: {
        _id: Id<"services">
        name: string
        duration: number
        price: number
    }[]
}
export const createBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        startTime: v.string(),
        date: v.string(),
        staffId: v.id("staff"),
        customerId: v.id("customers"),
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("bookings", args);
    },
});

export default function BookingForm({ organizationId, services }: BookingFormProps) {
    const { toast } = useToast();
    const createBooking = useMutation(api.bookings.createBooking);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedService, setSelectedService] = useState<Id<"services"> | undefined>();
    const [startTime, setStartTime] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [customerEmail, setCustomerEmail] = useState<string>("");
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const [selectedStaff, setSelectedStaff] = useState<Id<"staff"> | undefined>();
    const [selectedCustomer, setSelectedCustomer] = useState<Id<"customers"> | undefined>();

    const availableTimeSlots = useQuery(
        api.bookings.getAvailableTimeSlots,
        () => {
            if (selectedDate && selectedService) {
                return {
                    organizationId,
                    serviceId: selectedService,
                    date: selectedDate.toISOString().split("T")[0],
                };
            } else {
                return undefined;
            }
        }
    );

    useEffect(() => {
        if (availableTimeSlots && availableTimeSlots.length > 0) {
            setStartTime(availableTimeSlots[0].startTime);
            setSelectedStaff(availableTimeSlots[0].staffId);
        } else {
            setStartTime("");
            setSelectedStaff(undefined);
        }
    }, [availableTimeSlots]);

    const handleCreateBooking = async () => { // Move logic inside the handler function
        if (!selectedDate || !selectedService || !startTime || !customerName || !customerEmail || !selectedStaff || !selectedCustomer) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            await createBooking({
                organizationId,
                serviceId: selectedService,
                date: selectedDate.toISOString().split("T")[0],
                startTime,
                staffId: selectedStaff,
                customerId: selectedCustomer,
                customerName,
                customerEmail,
                customerPhone,
            });

            toast({
                title: "Booking created",
                description: "The booking has been created successfully.",
            });
            // Reset form
            setSelectedDate(new Date());
            setSelectedService(undefined);
            setStartTime("");
            setSelectedStaff(undefined);
            setSelectedCustomer(undefined);
            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create booking. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4" >
            <h2 className="text-2xl font-bold">Create Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                </div>
                <div className="space-y-4">
                    <Select onValueChange={(value) => setSelectedService(value as Id<"services">)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((service) => (
                                <SelectItem key={service._id} value={service._id}>
                                    {service.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setStartTime} value={startTime}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTimeSlots?.map((slot) => (
                                <SelectItem key={slot.startTime} value={slot.startTime}>
                                    {slot.startTime}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name"
                    />
                    <Input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Customer Email"
                    />
                    <Input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Customer Phone (optional)"
                    />
                    <Button onClick={handleCreateBooking}>Create Booking</Button>
                </div>
            </div>
        </div >
    ) // Added closing parenthesis for the component
}