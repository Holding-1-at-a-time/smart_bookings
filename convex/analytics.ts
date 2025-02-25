/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:23:39
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const generateBasicRevenueReport = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) =>
                    q.eq("organizationId", organizationId).gte("date", startDate).lte("date", endDate),
                )
                .collect()

            const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
            const averageRevenue = totalRevenue / bookings.length || 0

            const report = {
                totalRevenue,
                averageRevenue,
                totalBookings: bookings.length,
                startDate,
                endDate,
            }

            loggingService.info(`Basic revenue report generated`, { organizationId, startDate, endDate })
            return report
        } catch (error) {
            loggingService.error(`Error generating basic revenue report: ${error}`, { organizationId, startDate, endDate })
            throw new Error("Failed to generate basic revenue report")
        }
    },
})

export const calculateBookingStats = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) =>
                    q.eq("organizationId", organizationId).gte("date", startDate).lte("date", endDate),
                )
                .collect()

            const totalBookings = bookings.length
            const completedBookings = bookings.filter((booking) => booking.status === "completed").length
            const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled").length

            const stats = {
                totalBookings,
                completedBookings,
                cancelledBookings,
                completionRate: totalBookings > 0 ? completedBookings / totalBookings : 0,
                cancellationRate: totalBookings > 0 ? cancelledBookings / totalBookings : 0,
                startDate,
                endDate,
            }

            loggingService.info(`Booking stats calculated`, { organizationId, startDate, endDate })
            return stats
        } catch (error) {
            loggingService.error(`Error calculating booking stats: ${error}`, { organizationId, startDate, endDate })
            throw new Error("Failed to calculate booking stats")
        }
    },
})

