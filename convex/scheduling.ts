/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:22:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { loggingService } from "../lib/logging-service"
import { ollama } from "ollama-ai-provider"

export const getAvailableSlots = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, date } = args

        try {
            const service = await ctx.db.get(serviceId)
            if (!service || service.organizationId !== organizationId) {
                throw new Error("Service not found or access denied")
            }

            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) => q.eq("organizationId", organizationId).eq("date", date))
                .collect()

            // Implement logic to determine available slots based on service duration and existing bookings
            // This is a simplified version and should be expanded based on your specific requirements
            const availableSlots = calculateAvailableSlots(bookings, service.duration)

            loggingService.info(`Available slots retrieved for: ${organizationId}`, { serviceId, date })
            return availableSlots
        } catch (error) {
            loggingService.error(`Error getting available slots: ${error}`, { organizationId, serviceId, date })
            throw new Error("Failed to get available slots")
        }
    },
})

export const optimizeSchedule = mutation({
    args: {
        organizationId: v.id("organizations"),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, date } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) => q.eq("organizationId", organizationId).eq("date", date))
                .collect()

            // Implement basic AI-driven scheduling logic
            // This is a placeholder and should be replaced with actual AI logic
            const optimizedSchedule = basicScheduleOptimization(bookings)

            // Update bookings with optimized schedule
            for (const booking of optimizedSchedule) {
                await ctx.db.patch(booking._id, { time: booking.optimizedTime })
            }

            loggingService.info(`Schedule optimized for: ${organizationId}`, { date })
            return { success: true, optimizedSchedule }
        } catch (error) {
            loggingService.error(`Error optimizing schedule: ${error}`, { organizationId, date })
            throw new Error("Failed to optimize schedule")
        }
    },
})

type Booking = {
    startTime: string;
    endTime: string;
};
function calculateAvailableSlots(bookings: Booking[], serviceDuration: number): string[] {
    // Implement logic to calculate available slots based on bookings and service duration, and return an array of available time slots a user can book. This should be an efficient algorithm that takes into account the service duration, existing bookings, and business hours.
    const bookingsStartTimes = bookings.map((booking) => new Date(booking.startTime));
    const bookingsStartTimesMinutes = bookingsStartTimes.map((time) => time.getHours() * 60 + time.getMinutes());

    const businessHours = getBusinessHours();
    const businessHoursMinutes = businessHours.map((time) => time.getHours() * 60 + time.getMinutes());

    const availableSlots: string[] = [];
    for (let time = businessHoursMinutes[0]; time < businessHoursMinutes[1]; time += 15) {
        const conflicts = bookingsStartTimesMinutes.some((conflictTime) => {
            return (
                conflictTime >= time &&
                conflictTime < time + serviceDuration
            );
        });
        if (!conflicts) {
            const timeString = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
            availableSlots.push(timeString);
        }
    }
    return availableSlots;
}
function getBusinessHours(): { hours: number, minutes: number }[] {
    return [
        { hours: 9, minutes: 0 },
        { hours: 17, minutes: 0 },
    ];
}
/**
 * Updates bookings with an AI agent that will provide optimized scheduling dynamically based on the service duration, typeof service, business hours and existing bookings.
 *
 * @param bookings - The bookings to optimize, as an array of `Booking` objects.
 * @param serviceDuration - The duration of the service, in minutes.
 * @returns The optimized bookings, as an array of `Booking` objects with the `optimizedTime` property set to the new time.
 */
async function optimizeBookingWithAI(bookings: Booking[] | null, serviceDuration: number): Promise<Booking[] | null> {
    if (!bookings) {
        throw new Error("Bookings cannot be null or undefined.");
    }

    const provider = new ollama.Provider()
    const ai = new ollama.AI(provider)

    const optimizedBookings: Booking[] = []

    for (const booking of bookings) {
        if (!booking) {
            throw new Error("Booking cannot be null or undefined.");
        }

        const prompt = generateText(booking, serviceDuration)
        const response = await ai.generate(prompt)

        if (!response) {
            throw new Error("AI response cannot be null or undefined.");
        }

        const optimizedTime = new Date(response)
        optimizedTime.setMinutes(optimizedTime.getMinutes() + serviceDuration)

        optimizedBookings.push({
            ...booking,
            optimizedTime: optimizedTime.toISOString(),
        })
    }

    return optimizedBookings
}
async function scheduleBookingWithAI(organizationId: string, booking: Booking | null): Promise<void> {
    if (!booking) {
        throw new Error("Booking cannot be null or undefined.");
    }

    try {
        // Fetch existing bookings for the organization on the booking date
        const existingBookings = await fetchBookingsForDate(organizationId, booking.startTime.split("T")[0]);

        // Optimize booking time using AI logic
        const optimizedBookings = await optimizeBookingWithAI([booking, ...existingBookings], 60);

        if (!optimizedBookings) {
            throw new Error("Optimized bookings cannot be null or undefined.");
        }

        // Update the booking with the optimized time
        booking.startTime = optimizedBookings[0].optimizedTime;

        // Save the booking to the Convex database
        await saveBookingToDatabase(organizationId, booking);
    } catch (error) {
        console.error("Error scheduling booking with AI:", error);
        throw new Error("Failed to schedule booking with AI.");
    }
}
/**
 * Fetches bookings for a given organization and date from the Convex database.
 *
 * @param organizationId - The ID of the organization to fetch bookings for.
 * @param date - The date to fetch bookings for, in the format "YYYY-MM-DD".
 * @returns The bookings for the given organization and date, as an array of `Booking` objects.
 */
async function fetchBookingsForDate(
    organizationId: string,
    date: string
): Promise<Booking[]> {
    const query = api.bookings.listBookings;
    const args = {
        organizationId,
        date,
    };
    return await query(args);

}
/**
 * Saves a booking to the Convex database.
 *
 * @param organizationId - The ID of the organization that the booking belongs to.
 * @param booking - The booking to be saved, including the service ID, customer ID, date, and time.
 */
async function saveBookingToDatabase(
    organizationId: string,
    booking: {
        serviceId: string;
        customerId: string;
        startTime: string;
    },
): Promise<void> {

    // Save the booking to the Convex database
    const query = api.bookings.createBooking;
    const args = {
        organizationId,
        serviceId: booking.serviceId,
        customerId: booking.customerId,
        date: booking.startTime.split("T")[0],
        time: booking.startTime.split("T")[1],
    };
    await query(args);

}

