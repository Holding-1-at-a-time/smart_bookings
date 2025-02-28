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
import { mutation, query, QueryCtx } from "./_generated/server"
import { loggingService } from "../lib/logging-service"
import { Id } from "./_generated/dataModel"

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
export const getAvailableDates = query({
    args: { organizationId: v.id("organizations"), serviceId: v.id("services") },
    handler: async (ctx, args) => {
        const { organizationId, serviceId } = args
        const today = new Date()
        const dates: { date: string; times: string[] }[] = []

        for (let i = 0; i < 7; i++) {
            const date = new Date(today.setDate(today.getDate() + i))
            const year = date.getFullYear()
            const month = `0${date.getMonth() + 1}`.slice(-2)
            const day = `0${date.getDate()}`.slice(-2)
            const dateString = `${year}-${month}-${day}`

            try {
                const availableTimes = await ctx.db.getAvailableTimes(organizationId, serviceId, dateString)
                if (availableTimes.length > 0) {
                    dates.push({ date: dateString, times: availableTimes })
                }
            } catch (error) {
                loggingService.error(`Error fetching available times for date ${dateString}: ${error}`, { organizationId, serviceId, dateString })
                throw new Error("Failed to fetch available times")
            }
        }

        loggingService.info(`Available dates retrieved for organization: ${organizationId}, service: ${serviceId}`)
        return dates
    },
})


export const getAvailableTimes = query({
    args: { organizationId: v.id("organizations"), serviceId: v.id("services"), date: v.string() },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, date } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", q =>
                    q.eq("organizationId", organizationId)
                        .eq("serviceId", serviceId)
                        .eq("date", date)
                )
                .collect();
            const organization = await ctx.db.get(organizationId);
            if (!organization) {
                throw new Error(`Organization not found: ${organizationId}`);
            }

            const businessHours = organization.businessHours ?? [];
            const serviceDuration = (await ctx.db.get(serviceId))?.duration ?? 0;

            const allSlots: string[] = [];
            businessHours.forEach(businessHour => {
                const startDate = new Date(`${date}T${businessHour.start}`);
                const endDate = new Date(`${date}T${businessHour.end}`);

                for (let current = startDate; current < endDate; current.setMinutes(current.getMinutes() + serviceDuration)) {
                    const slot = current.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
                    allSlots.push(slot);
                }
            });

            const bookedSlots = bookings.map(booking => booking.startTime);

            return allSlots.filter(slot => !bookedSlots.includes(slot));
        } catch (error) {
            loggingService.error(`Error getting available times: ${error}`, { organizationId, serviceId, date })
            throw new Error("Failed to get available times");
        }
    },
});

export const bookingsList = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        date: v.string(),
        startTime: v.string(),
        endTime: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const bookings = await ctx.db.get(args.id);
        if (bookings === null) {
            return null;
        }
        return {
            bookings, date: await getBookingById(ctx, bookings._id ?? null);
        }
    });
    async function getBookingById(ctx: QueryCtx, bookingsId: Id<"bookings"> | null) {
        if (bookingsId === null) {
            return null;
        }
        return (await ctx.db.get(bookingsId))?.bookings;
    }



            .query("bookings")
    .withIndex("by_organization_and_by_date", (q) => q.eq("organizationId", args.organizationId).eq("serviceId", args.serviceId).eq("date", args.date))
    .paginate(args.serviceId, args.startTime, args.endTime, args.status)
    .take(15)
return args.organizationId === "all" ? bookings : bookings;
    },
});

export const listOfBookings = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.optional(v.id("services")),
        date: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<Booking[]> => {
        const { organizationId, serviceId, date, startTime, endTime, status } = args;

        let query = ctx.db.query("bookings")
            .withIndex("by_organization", q => q.eq("organizationId", organizationId));

        if (serviceId) {
            query = query.filter(q => q.eq("serviceId", serviceId));
        }
        if (date) {
            query = query.filter(q => q.eq("date", date));
        }
        if (startTime) {
            query = query.filter(q => q.eq("startTime", startTime));
        }
        if (endTime) {
            query = query.filter(q => q.eq("endTime", endTime));
        }
        if (status) {
            query = query.filter(q => q.eq("status", status));
        }

        return await query.collect<Booking>();
    },
});