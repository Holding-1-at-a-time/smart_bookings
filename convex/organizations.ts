/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 22:37:40
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"


// Internal mutation for ACID-compliant data operations
const internalUpsertOrganizationData = internalMutation({
    args: {
        organizationId: v.id("organizations"),
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, key, value } = args

        const existingData = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.eq(q.field("key"), key))
            .first()

        if (existingData) {
            await ctx.db.patch(existingData._id, { value })
        } else {
            await ctx.db.insert("organizationData", {
                organizationId,
                key,
                value,
                createdAt: new Date().toISOString(),
            })
        }
    },
})

// Public mutation for adding or updating organization data
export const upsertOrganizationData = mutation({
    args: {
        organizationId: v.id("organizations"),
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.runMutation(internalUpsertOrganizationData, args)
    },
})

// Query to list organization data
export const listOrganizationData = query({
    args: {
        organizationId: v.id("organizations"),
        count: v.number(),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, count, cursor } = args

        let query = ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .order("desc")

        if (cursor) {
            query = query.startAfter(cursor)
        }

        const data = await query.take(count)

        const newCursor = data.length > 0 ? data[data.length - 1]._id : null

        return {
            data: data.map((item) => ({
                id: item._id,
                key: item.key,
                value: item.value,
                createdAt: item.createdAt,
            })),
            cursor: newCursor,
        }
    },
})

// Query to get specific organization data by key
export const getOrganizationDataByKey = query({
    args: {
        organizationId: v.id("organizations"),
        key: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, key } = args

        const data = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.eq(q.field("key"), key))
            .first()

        return data
            ? {
                id: data._id,
                key: data.key,
                value: data.value,
                createdAt: data.createdAt,
            }
            : null
    },
})

// Mutation to delete organization data
export const deleteOrganizationData = mutation({
    args: {
        organizationId: v.id("organizations"),
        key: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, key } = args

        const dataToDelete = await ctx.db
            .query("organizationData")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.eq(q.field("key"), key))
            .first()

        if (dataToDelete) {
            await ctx.db.delete(dataToDelete._id)
            return true
        }
        return false
    },
})

