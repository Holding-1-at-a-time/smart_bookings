/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:45:37
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { v } from "convex/values"
import { mutation, query } from "./_generated/server"


// Services
export const createService = mutation({
    args: {
        organizationId: v.id("organizations"),
        categoryId: v.optional(v.id("serviceCategories")),
        name: v.string(),
        description: v.string(),
        duration: v.number(),
        price: v.number(),
        features: v.array(v.string()),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) {
          throw new Error("Unauthorized")
        }

        return await ctx.db.insert("services", {
            ...args,
            isActive: true,
        })
    },
})

export const updateService = mutation({
    args: {
        id: v.id("services"),
        categoryId: v.optional(v.id("serviceCategories")),
        name: v.string(),
        description: v.string(),
        duration: v.number(),
        price: v.number(),
        isActive: v.boolean(),
        features: v.array(v.string()),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
        addOns: v.array(
            v.object({
                name: v.string(),
                price: v.number(),
                duration: v.optional(v.number()),
            }),
        ),
        variations: v.array(
            v.object({
                name: v.string(),
                price: v.number(),
                duration: v.optional(v.number()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const service = await ctx.db.get(id)
        if (!service) throw new Error("Service not found")

        return await ctx.db.patch(id, updates)
    },
})

export const deleteService = mutation({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const service = await ctx.db.get(args.id)
        if (!service) throw new Error("Service not found")

        await ctx.db.delete(args.id)
    },
})

export const listServices = query({
    args: {
        organizationId: v.id("organizations"),
        categoryId: v.optional(v.id("serviceCategories")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        let query = ctx.db
            .query("services")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))

        if (args.categoryId) {
            query = query.filter((q) => q.eq(q.field("categoryId"), args.categoryId))
        }

        return await query.collect()
    },
})

export const getService = query({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")
        try {
            const service = await ctx.db.get(args.id)
        }
        catch (error) {
            console.error(error)
            throw new Error("Service not found")
        }
        return service
    },
})

export const createPricingRule = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        name: v.string(),
        type: v.string(),
        value: v.number(),
        isPercentage: v.boolean(),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        daysOfWeek: v.optional(v.array(v.number())),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        return await ctx.db.insert("pricingRules", args)
    },
})

export const updatePricingRule = mutation({
    args: {
        id: v.id("pricingRules"),
        name: v.string(),
        type: v.string(),
        value: v.number(),
        isPercentage: v.boolean(),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        daysOfWeek: v.optional(v.array(v.number())),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const rule = await ctx.db.get(id)
        if (!rule) throw new Error("Pricing rule not found")

        return await ctx.db.patch(id, updates)
    },
})

export const deletePricingRule = mutation({
    args: { id: v.id("pricingRules") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const rule = await ctx.db.get(args.id)
        if (!rule) {

        await ctx.db.delete(args.id)
    },
})

export const listPricingRules = query({
    args: { serviceId: v.id("services") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        return await ctx.db
            .query("pricingRules")
            .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
            .collect()
    },
})

export const createAvailability = mutation({
    args: {
        organizationId: v.id("organizations"),
        providerId: v.id("users"),
        serviceId: v.id("services"),
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isRecurring: v.boolean(),
        date: v.optional(v.string()),
        maxBookings: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) {

        return await ctx.db.insert("availability", args)
    },
})

export const updateAvailability = mutation({
    args: {
        id: v.id("availability"),
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isRecurring: v.boolean(),
        date: v.optional(v.string()),
        maxBookings: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const availability = await ctx.db.get(id)
        if (!availability) {

        return await ctx.db.patch(id, updates)
    },
})

export const deleteAvailability = mutation({
    args: { id: v.id("availability") },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        const availability = await ctx.db.get(args.id)
        if (!availability) throw new Error("Availability not found")

        await ctx.db.delete(args.id)
    },
})

export const listAvailability = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.optional(v.id("services")),
        providerId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user) throw new Error("Unauthorized")

        let query = ctx.db
            .query("availability")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))

        if (args.serviceId) {
            query = query.filter((q) => q.eq(q.field("serviceId"), args.serviceId))
        }

        if (args.providerId) {
            query = query.filter((q) => q.eq(q.field("providerId"), args.providerId))
        }

        return await query.collect()
    },
})

// Service Categories
export const createServiceCategory = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
        description: v.optional(v.string()),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const { organizationId, name, description, order } = args
        return await ctx.db.insert("serviceCategories", {
            organizationId,
            name,
            description,
            order,
            isActive: true,
            id: undefined,
            category: []
        })
    },
})

export const updateServiceCategory = mutation({
    args: {
        id: v.id("serviceCategories"),
        name: v.string(),
        description: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        return await ctx.db.patch(id, updates)
    },
})

export const deleteServiceCategory = mutation({
    args: {
        id: v.id("serviceCategories"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    },
})

export const listServiceCategories = query({
    args: {
        organizationId: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("serviceCategories")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .order("asc")
            .collect()
    },
})