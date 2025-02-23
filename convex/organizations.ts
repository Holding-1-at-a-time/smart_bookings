/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 00:23:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const upsertOrganizationData = mutation({
    args: {
        organizationId: v.id("organizations"),
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, key, value } = args

        const existingData = await ctx.db
            .query("organizationData")
            .withIndex("by_organization_and_key", (q) => q.eq("organizationId", organizationId).eq("key", key))
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

// Query to list organization data
export const listOrganizationData = query({
    args: {
        organizationId: v.id("organizations"),
        count: v.number(),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, count } = args

        const query = ctx.db
            .query("organizationData")
            .withIndex("by_organization", q => q.eq("organizationId", organizationId))
            .order("desc");

        if (args.cursor) {
            query.filter(q => q.gt(q.field("_id"), organizationId));
        }

        const data = await query.take(count);
        const cursor = data.length === count ? data[data.length - 1]._id : null;

        return {
            data: data.map((item) => ({
                id: item._id,
                key: item.key,
                value: item.value,
                createdAt: item.createdAt,
            })),
            cursor: cursor,
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


export const getOrganizationData = query({
    args: {
        id: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        const organization = await ctx.db.get(args.id)
        if (!organization) {
            throw new Error("Organization not found")
        }
        return organization
    },
})

export const updateOrganizationData = mutation({
    args: {
        id: v.id("organizations"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        address: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        slug: v.optional(v.string()),
        logo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const existingOrganization = await ctx.db.get(id)
        if (!existingOrganization) {
            throw new Error("Organization not found")
        }

        const updatedOrganization = {
            ...existingOrganization,
            ...updates,
        }

        return await ctx.db.patch(id, updatedOrganization)
    },
})