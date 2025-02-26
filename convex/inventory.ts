/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:27:04
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

export const addItem = mutation({
    args: {
        organizationId: v.string(),
        name: v.string(),
        quantity: v.number(),
        unit: v.string(),
        reorderPoint: v.number(),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, quantity, unit, reorderPoint } = args

        try {
            const itemId = await ctx.db.insert("inventory", {
                organizationId,
                name,
                quantity,
                unit,
                reorderPoint,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })

            loggingService.info(`Inventory item added: ${itemId}`, { organizationId, name })
            return { success: true, itemId }
        } catch (error) {
            loggingService.error(`Error adding inventory item: ${error}`, { organizationId, name })
            throw new Error("Failed to add inventory item")
        }
    },
})

export const listItems = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        const { organizationId } = args

        try {
            const items = await ctx.db
                .query("inventory")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            loggingService.info(`Inventory items listed for organization: ${organizationId}`)
            return items
        } catch (error) {
            loggingService.error(`Error listing inventory items: ${error}`, { organizationId })
            throw new Error("Failed to list inventory items")
        }
    },
})

