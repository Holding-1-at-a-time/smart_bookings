/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 22:40:56
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"


// Internal mutations for ACID operations
const internalCreateOrUpdateUser = internalMutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        role: v.string(),
        organizationId: v.optional(v.id("organizations")),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const { clerkId, name, email, role, organizationId, metadata } = args
        const now = new Date().toISOString()

        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .unique()

        if (existingUser) {
            return await ctx.db.patch(existingUser._id, {
                name,
                email,
                role,
                organizationId,
                metadata,
                updatedAt: now,
            })
        } else {
            return await ctx.db.insert("users", {
                organizationId: v.id("organizations"),
                clerkId: v.string(),
                name: v.string(),
                email: v.string(),
                role: v.string(),
                metadata: v.optional(v.any()),
                updatedAt: v.string(),
            })
        }
    },
})

const internalDeleteUser = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const { userId } = args

        // Delete user's sessions
        const sessions = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect()

        for (const session of sessions) {
            await ctx.db.delete(session._id)
        }

        // Delete the user
        await ctx.db.delete(userId)
    },
})

// Public mutations
export const createOrUpdateUser = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        role: v.string(),
        organizationId: v.optional(v.id("organizations")),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        return await ctx.runMutation(internalCreateOrUpdateUser, args)
    },
})

export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)
        if (!user) {
            throw new Error("User not found")
        }
        await ctx.runMutation(internalDeleteUser, args)
        return true
    },
})

export const updateUserRole = mutation({
    args: { userId: v.id("users"), newRole: v.string() },
    handler: async (ctx, args) => {
        const { userId, newRole } = args
        const user = await ctx.db.get(userId)
        if (!user) {
            throw new Error("User not found")
        }
        return await ctx.db.patch(userId, {
            role: newRole,
            updatedAt: new Date().toISOString(),
        })
    },
})

export const updateUserOrganization = mutation({
    args: { userId: v.id("users"), organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        const { userId, organizationId } = args
        const user = await ctx.db.get(userId)
        if (!user) {
            throw new Error("User not found")
        }
        return await ctx.db.patch(userId, {
            organizationId,
            updatedAt: new Date().toISOString(),
        })
    },
})

// Queries
export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId)
    },
})

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique()
    },
})

export const listUsers = query({
    args: {
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
        cursor: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const { organizationId, limit, cursor } = args
        let userQuery = ctx.db.query("users")

        if (organizationId) {
        userQuery.withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
        }

        userQuery.order("desc")

        if (cursor) {
            userQuery = userQuery.startAfter(cursor)
        }

        if (limit) {
        userQuery.take(limit)
        }

        const users = await userQuery.collect()
        const newCursor = users.length > 0 ? users[users.length - 1]._id : null

        return {
            users,
            cursor: newCursor,
        }
    },
})

export const searchUsers = query({
    args: {
        searchTerm: v.string(),
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { searchTerm, organizationId, limit } = args
        let userQuery = ctx.db
            .query("users")
            .withIndex("search_name_email", (q) => q.search("name", searchTerm).or(q.search("email", searchTerm)))

        if (organizationId) {
            userQuery = userQuery.filter((q) => q.eq(q.field("organizationId"), organizationId))
        }

        if (limit) {
        userQuery.take(limit)
        }

        return await userQuery.collect()
    },
})

export const storeUserSession = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        userName: v.optional(v.string()),
        firstName: v.string(),
        familyName: v.string(),
        phoneNumber: v.optional(v.string()),
        emailVerified: v.boolean(),
        hasVerifiedContactInfo: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
        metadata: v.any(),
        unsafeMetadata: v.any(),
        privateMetadata: v.any(),
        organizationId: v.optional(v.id("organizations")),
        organizationName: v.optional(v.string()),
        organizationRole: v.optional(v.string()),
        organizationSlug: v.optional(v.string()),
        organizationLogo: v.optional(v.string()),
        hasOrgLogo: v.optional(v.boolean()),
        organizationPermissions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { clerkId, name, email, organizationRole, organizationId, ...metadataFields } = args

        return await ctx.runMutation(internalCreateOrUpdateUser, {
            clerkId,
            name,
            email,
            role: organizationRole || "member",
            organizationId,
            metadata: metadataFields,
        })
    },
})

