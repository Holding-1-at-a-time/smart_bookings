/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 13:21:32
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

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

        // Check organization business hours
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        const businessHours = JSON.parse(organization.businessHours)
        const bookingDay = new Date(date).getDay()
        const dayHours = businessHours[bookingDay]

        if (!dayHours || !isWithinBusinessHours(startTime, dayHours.start, dayHours.end)) {
            throw new Error("Booking time is outside of business hours")
        }

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

        // Check service provider availability
        const serviceProvider = await ctx.db.get(service.providerId)
        if (!serviceProvider) {
            throw new Error("Service provider not found")
        }

        if (!isProviderAvailable(serviceProvider, date, startTime, bookingEndTime)) {
            throw new Error("Service provider is not available at the selected time")
        }

        // Create the booking
        const newBooking = await ctx.db.insert("bookings", {
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
            updatedAt: new Date().toISOString(),
        })

        return newBooking
    },
})

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

function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number)
    const date = new Date(0, 0, 0, hours, mins)
    date.setMinutes(date.getMinutes() + minutes)
    return date.toTimeString().slice(0, 5)
}

function isWithinBusinessHours(time: string, start: string, end: string): boolean {
    return time >= start && time <= end
}

function isProviderAvailable(provider: any, date: string, start: string, end: string): boolean {
    // Implement provider availability check logic here
    // This is a placeholder implementation
    return true
}

export const getFilteredBookings = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate, status } = args

        let bookingsQuery = ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("date"), startDate))
            .filter((q) => q.lte(q.field("date"), endDate))

        if (status) {
            bookingsQuery = bookingsQuery.filter((q) => q.eq(q.field("status"), status))
        }

        return await bookingsQuery.collect()
    },
})

export const updateBookingStatus = mutation({
    args: {
        bookingId: v.id("bookings"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const { bookingId, status } = args

        const booking = await ctx.db.get(bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        await ctx.db.patch(bookingId, { status })
        return true
    },
})

export const getBookingStats = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("date"), startDate))
            .filter((q) => q.lte(q.field("date"), endDate))
            .collect()

        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
        const statusCounts = bookings.reduce(
            (counts, booking) => {
                counts[booking.status] = (counts[booking.status] || 0) + 1
                return counts
            },
            {} as Record<string, number>,
        )

        return {
            totalBookings,
            totalRevenue,
            statusCounts,
        }
    },
})

