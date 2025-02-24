/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:19:35
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

export const createOrganization = mutation({
    args: {
        name: v.string(),
        ownerId: v.string(),
    },
    handler: async (ctx, args) => {
        const { name, ownerId } = args

        try {
            const organizationId = await ctx.db.insert("organizations", {
                name,
                ownerId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            loggingService.info(`Organization created: ${organizationId}`, { name, ownerId })
            return { success: true, organizationId }
        } catch (error) {
            loggingService.error(`Error creating organization: ${error}`, { name, ownerId })
            throw new Error("Failed to create organization")
        }
    },
})

export const updateOrganization = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, name } = args

        try {
            const organization = await ctx.db.get(organizationId)
            if (!organization) {
                throw new Error("Organization not found")
            }

            const updates: { name?: string; updatedAt: string } = {
                updatedAt: new Date().toISOString(),
            }
            if (name !== undefined) {
                updates.name = name
            }

            await ctx.db.patch(organizationId, updates)

            loggingService.info(`Organization updated: ${organizationId}`, { updates })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating organization: ${error}`, { organizationId, name })
            throw new Error("Failed to update organization")
        }
    },
})

export const getOrganizationById = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const organization = await ctx.db.get(organizationId)
            if (!organization) {
                throw new Error("Organization not found")
            }

            loggingService.info(`Organization retrieved: ${organizationId}`)
            return organization
        } catch (error) {
            loggingService.error(`Error retrieving organization: ${error}`, { organizationId })
            throw new Error("Failed to retrieve organization")
        }
    },
})

