/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:24:11
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

export const updateOrganizationSettings = mutation({
    args: {
        organizationId: v.id("organizations"),
        settings: v.object({
            businessName: v.string(),
            businessHours: v.array(v.object({
                day: v.string(),
                open: v.string(),
                close: v.string(),
            })),
            notificationPreferences: v.object({
                emailNotifications: v.boolean(),
                smsNotifications: v.boolean(),
            }),
            customTheme: v.object({
                primaryColor: v.string(),
                secondaryColor: v.string(),
            }),
        }),
    },
    handler: async (ctx, { organizationId, settings }) => {
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        await ctx.db.patch(organizationId, { settings: { ...settings } }); // Update name and settings
    },
})

export const getOrganizationSettings = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const organization = await ctx.db.get(organizationId)
            if (!organization) {
                throw new Error("Organization not found")
            }

            loggingService.info(`Organization settings retrieved`, { organizationId })
            return organization.settings
        } catch (error) {
            loggingService.error(`Error retrieving organization settings: ${error}`, { organizationId })
            throw new Error("Failed to retrieve organization settings")
        }
    },
})

