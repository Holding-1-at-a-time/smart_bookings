/**
 * @description      : 
 * @author           : rrome
 * @group            : 
 * @created          : 21/02/2025 - 09:01:26
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 21/02/2025
 * - Author          : rrome
 * - Modification    : 
 */
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Query to get the availability of a specific organization
 * @param organizationId - The id of the organization to get the availability for
 * @returns The availability of the specified organization
 */
export const getAvailability = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        // Get all availability records with the specified organizationId
        return await ctx.db
                    .query("availability")
                    .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
                    .collect();
    },
})

/**
 * Mutation to update the availability of a specific organization
 * @param organizationId - The id of the organization to update the availability for
 * @param dayOfWeek - The day of the week to update the availability for
 * @param startTime - The new start time of the availability
 * @param endTime - The new end time of the availability
 */
export const updateAvailability = mutation({
    args: {
        organizationId: v.id("organizations"),
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, dayOfWeek, startTime, endTime } = args

        // Check if the availability record for the specified organization and day of week already exists
        const existingAvailability = await ctx.db
            .query("availability")
            .withIndex("by_organization_and_day_of_week", (q) =>
                q.eq("organizationId", organizationId).eq("dayOfWeek", dayOfWeek),
            )
            .first()

        // If the availability record already exists, update it
        if (existingAvailability) {
            await ctx.db.patch(existingAvailability._id, { startTime, endTime })
        } else {
            // If the availability record does not exist, create a new one
            await ctx.db.insert("availability", { organizationId, dayOfWeek, startTime, endTime })
        }
    },
})

