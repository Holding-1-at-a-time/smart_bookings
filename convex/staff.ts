/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:22:39
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
import { Id } from "convex/values"

export const addStaffMember = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
        email: v.string(),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, email, role } = args

        try {
            const staffId = await ctx.db.insert("staff", {
                organizationId,
                name,
                email,
                role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
                userId: Id<"users">,
                specialties: []
            })

            loggingService.info(`Staff member added: ${staffId}`, { organizationId, name, email })
            return { success: true, staffId }
        } catch (error) {
            loggingService.error(`Error adding staff member: ${error}`, { organizationId, name, email })
            throw new Error("Failed to add staff member")
        }
    },
})

export const listStaffMembers = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const staffMembers = await ctx.db
                .query("staff")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Staff members listed for organization: ${organizationId}`)
            return staffMembers
        } catch (error) {
            loggingService.error(`Error listing staff members: ${error}`, { organizationId })
            throw new Error("Failed to list staff members")
        }
    },
})

export const assignStaffToBooking = mutation({
    args: {
        organizationId: v.id("organizations"),
        bookingId: v.id("bookings"),
        staffId: v.id("staff"),
    },
    handler: async (ctx, args) => {
        const { organizationId, bookingId, staffId } = args

        try {
            const booking = await ctx.db.get(bookingId)
            const staffMember = await ctx.db.get(staffId)

            if (!booking || booking.organizationId !== organizationId) {
                throw new Error("Booking not found or access denied")
            }

            if (!staffMember || staffMember.organizationId !== organizationId) {
                throw new Error("Staff member not found or access denied")
            }

            await ctx.db.patch(bookingId, { staffId, updatedAt: new Date().toISOString() })

            loggingService.info(`Staff assigned to booking: ${bookingId}`, { organizationId, staffId })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error assigning staff to booking: ${error}`, { organizationId, bookingId, staffId })
            throw new Error("Failed to assign staff to booking")
        }
    },
})

