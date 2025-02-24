/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:23:11
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

export const createCustomer = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, email, phone } = args

        try {
            const customerId = await ctx.db.insert("customers", {
                organizationId,
                name,
                email,
                phone,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })

            loggingService.info(`Customer created: ${customerId}`, { organizationId, name, email })
            return { success: true, customerId }
        } catch (error) {
            loggingService.error(`Error creating customer: ${error}`, { organizationId, name, email })
            throw new Error("Failed to create customer")
        }
    },
})

export const updateCustomer = mutation({
    args: {
        organizationId: v.id("organizations"),
        customerId: v.id("customers"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, customerId, ...updates } = args

        try {
            const customer = await ctx.db.get(customerId)
            if (!customer || customer.organizationId !== organizationId) {
                throw new Error("Customer not found or access denied")
            }

            const updatedFields = {
                ...updates,
                updatedAt: new Date().toISOString(),
            }

            await ctx.db.patch(customerId, updatedFields)

            loggingService.info(`Customer updated: ${customerId}`, { organizationId, updates })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating customer: ${error}`, { organizationId, customerId })
            throw new Error("Failed to update customer")
        }
    },
})

export const getCustomerBookingHistory = query({
    args: {
        organizationId: v.id("organizations"),
        customerId: v.id("customers"),
    },
    handler: async (ctx, args) => {
        const { organizationId, customerId } = args

        try {
            const customer = await ctx.db.get(customerId)
            if (!customer || customer.organizationId !== organizationId) {
                throw new Error("Customer not found or access denied")
            }

            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_customer", (q) => q.eq("customerId", customerId))
                .order("desc")
                .collect()

            loggingService.info(`Customer booking history retrieved: ${customerId}`, { organizationId })
            return bookings
        } catch (error) {
            loggingService.error(`Error retrieving customer booking history: ${error}`, { organizationId, customerId })
            throw new Error("Failed to retrieve customer booking history")
        }
    },
})

