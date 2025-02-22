/**
 * @description      : Convex queries and mutations for bookings
 * @author           : rrome
 * @group            : Bookings
 * @created          : 21/02/2025 - 09:02:39
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 21/02/2025
 * - Author          : rrome
 * - Modification    : 
 **/

import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Get bookings for a given organization and date
 * @param organizationId The ID of the organization
 * @param date The date to retrieve bookings for
 * @returns An array of bookings
 */
export const getBookingsByDate = query({
    args: { organizationId: v.id("organizations"), date: v.string() },
    handler: async (ctx, args) => {
        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .filter((q) => q.eq(q.field("date"), args.date))
            .collect()
        return bookings
    },
})

/**
 * Create a new booking
 * @param organizationId The ID of the organization
 * @param serviceId The ID of the service
 * @param date The date of the booking
 * @param startTime The start time of the booking
 * @param customerName The name of the customer
 * @param customerEmail The email of the customer
 * @param customerPhone The phone number of the customer
 * @returns The newly created booking
 */
export const createBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        date: v.string(),
        startTime: v.string(),
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, date, startTime, customerName, customerEmail, customerPhone } = args

        // Check for conflicts
        const existingBookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.eq(q.field("date"), date))
            .collect()

        const service = await ctx.db.get(serviceId)
        if (!service) {
            throw new Error("Service not found")
        }

        const bookingEndTime = addMinutes(startTime, service.duration)

        const hasConflict = existingBookings.some((booking) => {
            const bookingStart = booking.startTime
            const bookingEnd = addMinutes(booking.startTime, service.duration)
            return (
                (startTime >= bookingStart && startTime < bookingEnd) ||
                (bookingEndTime > bookingStart && bookingEndTime <= bookingEnd)
            )
        })

        if (hasConflict) {
            throw new Error("Booking conflict: The selected time slot is not available")
        }

        // Create the booking
        return await ctx.db.insert("bookings", {
            organizationId,
            serviceId,
            date,
            startTime,
            endTime: bookingEndTime,
            status: "confirmed",
            customerName,
            customerEmail,
            customerPhone,
            totalPrice: service.price,
            notes: "",
            updatedOrganizationAt: new Date().toISOString(),
        });
    },
})

/**
 * Cancel a booking
 * @param bookingId The ID of the booking to cancel
 * @returns True if the booking was cancelled successfully
 */
export const cancelBooking = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, args) => {
        const booking = await ctx.db.get(args.bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        await ctx.db.patch(args.bookingId, { status: "cancelled" })
        return true
    },
})

/**
 * Add minutes to a given time string
 * @param time The time to add minutes to
 * @param minutes The number of minutes to add
 * @returns A new time string with the added minutes
 */
function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number)
    const date = new Date(0, 0, 0, hours, mins)
    date.setMinutes(date.getMinutes() + minutes)
    return date.toTimeString().slice(0, 5)
}

