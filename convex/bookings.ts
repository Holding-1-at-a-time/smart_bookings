/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:21:55
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const createBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        customerId: v.id("customers"),
        date: v.string(),
        time: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, customerId, date, time } = args

        try {
            const bookingId = await ctx.db.insert("bookings", {
                organizationId,
                serviceId,
                customerId,
                date,
                time,
                status: "confirmed",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })

            loggingService.info(`Booking created: ${bookingId}`, { organizationId, serviceId, customerId })
            return { success: true, bookingId }
        } catch (error) {
            loggingService.error(`Error creating booking: ${error}`, { organizationId, serviceId, customerId })
            throw new Error("Failed to create booking")
        }
    },
})

export const updateBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        bookingId: v.id("bookings"),
        serviceId: v.optional(v.id("services")),
        date: v.optional(v.string()),
        time: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, bookingId, ...updates } = args

        try {
            const booking = await ctx.db.get(bookingId)
            if (!booking || booking.organizationId !== organizationId) {
                throw new Error("Booking not found or access denied")
            }

            const updatedFields = {
                ...updates,
                updatedAt: new Date().toISOString(),
            }

            await ctx.db.patch(bookingId, updatedFields)

            loggingService.info(`Booking updated: ${bookingId}`, { organizationId, updates })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating booking: ${error}`, { organizationId, bookingId })
            throw new Error("Failed to update booking")
        }
    },
})

export const listBookings = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Bookings listed for organization: ${organizationId}`)
            return bookings
        } catch (error) {
            loggingService.error(`Error listing bookings: ${error}`, { organizationId })
            throw new Error("Failed to list bookings")
        }
    },
})

export const cancelBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        bookingId: v.id("bookings"),
    },
    handler: async (ctx, args) => {
        const { organizationId, bookingId } = args

        try {
            const booking = await ctx.db.get(bookingId)
            if (!booking || booking.organizationId !== organizationId) {
                throw new Error("Booking not found or access denied")
            }

            await ctx.db.patch(bookingId, { status: "cancelled", updatedAt: new Date().toISOString() })

            loggingService.info(`Booking cancelled: ${bookingId}`, { organizationId })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error cancelling booking: ${error}`, { organizationId, bookingId })
            throw new Error("Failed to cancel booking")
        }
    },
})

export const getBookingById = query({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, args) => {
        const { bookingId } = args
        try {
            return await ctx.db.get(bookingId);
        } catch (error) {
            loggingService.error(`Error getting booking by ID: ${error}`, { bookingId })
            throw new Error("Failed to get booking by ID")
        }
    },
})

