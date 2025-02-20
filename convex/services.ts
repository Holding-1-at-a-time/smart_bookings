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
            .order("asc", (q) => q.field("order"))
            .collect()
    },
})

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
        images: v.optional(v.array(v.string())),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
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
        images: v.optional(v.array(v.string())),
        maxBookingsPerDay: v.optional(v.number()),
        preparationTime: v.optional(v.number()),
        cleanupTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        return await ctx.db.patch(id, updates)
    },
})

export const deleteService = mutation({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    },
})

export const listServices = query({
    args: {
        organizationId: v.id("organizations"),
        categoryId: v.optional(v.id("serviceCategories")),
    },
    handler: async (ctx, args) => {
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
        return await ctx.db.get(args.id)
    },
})

