/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:21:11
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

export const createService = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, description, price, duration } = args

        try {
            const serviceId = await ctx.db.insert("services", {
                organizationId,
                name,
                description,
                price,
                duration,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: false,
                features: []
            })

            loggingService.info(`Service created: ${serviceId}`, { organizationId, name })
            return { success: true, serviceId }
        } catch (error) {
            loggingService.error(`Error creating service: ${error}`, { organizationId, name })
            throw new Error("Failed to create service")
        }
    },
})

export const updateService = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, ...updates } = args

        try {
            const service = await ctx.db.get(serviceId)
            if (!service || service.organizationId !== organizationId) {
                throw new Error("Service not found or access denied")
            }

            const updatedFields = {
                ...updates,
                updatedAt: new Date().toISOString(),
            }

            await ctx.db.patch(serviceId, updatedFields)

            loggingService.info(`Service updated: ${serviceId}`, { organizationId, updates })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating service: ${error}`, { organizationId, serviceId })
            throw new Error("Failed to update service")
        }
    },
})

export const listServices = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const services = await ctx.db
                .query("services")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Services listed for organization: ${organizationId}`)
            return services
        } catch (error) {
            loggingService.error(`Error listing services: ${error}`, { organizationId })
            throw new Error("Failed to list services")
        }
    },
})

