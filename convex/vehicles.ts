/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:26:52
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const addVehicle = mutation({
    args: {
        organizationId: v.string(),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        licensePlate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, make, model, year, licensePlate } = args

        try {
            const vehicleId = await ctx.db.insert("vehicles", {
                organizationId,
                make,
                model,
                year,
                licensePlate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })

            loggingService.info(`Vehicle added: ${vehicleId}`, { organizationId, make, model })
            return { success: true, vehicleId }
        } catch (error) {
            loggingService.error(`Error adding vehicle: ${error}`, { organizationId, make, model })
            throw new Error("Failed to add vehicle")
        }
    },
})

export const listVehicles = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const vehicles = await ctx.db
                .query("vehicles")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Vehicles listed for organization: ${organizationId}`)
            return vehicles
        } catch (error) {
            loggingService.error(`Error listing vehicles: ${error}`, { organizationId })
            throw new Error("Failed to list vehicles")
        }
    },
})

