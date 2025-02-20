/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 16:24:11
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
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique()

        const now = new Date().toISOString()

        if (existingUser) {
            return await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
                role: args.role,
                organizationId: args.organizationId,
                metaData: args.metadata,
                upDatedAt: now,
            })
        } else {
            return await ctx.db.insert("users", {
                clerkId: args.clerkId,
                name: args.name,
                email: args.email,
                role: args.role,
                organizationId: args.organizationId,
                metadata: args.metadata,
                createdAt: now,
                updatedAt: now,
            })
        }
    },
})

const internalDeleteUser = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // Delete user's sessions
        await ctx.db
            .query("userSessions")
            .withIndex("by_user_id", (q) => q.eq("clerkId", args.userId))
            .collect()
            .then((sessions) => {
                sessions.forEach((session) => {
                    ctx.db.delete(session._id)
                })
            })

        // Delete the user
        await ctx.db.delete(args.userId)
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
        const user = await ctx.db.get(args.userId)
        if (!user) {
            throw new Error("User not found")
        }
        return await ctx.db.patch(args.userId, {
            role: args.newRole,
            updatedAt: new Date().toISOString(),
        })
    },
})

export const updateUserOrganization = mutation({
    args: { userId: v.id("users"), organizationId: v.optional(v.id("organizations")) },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)
        if (!user) {
            throw new Error("User not found")
        }
        return await ctx.db.patch(args.userId, {
            organizationId: args.organizationId,
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
        let userQuery = ctx.db.query("users")

        if (args.organizationId) {
            userQuery = userQuery.withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
        }

        if (args.cursor) {
            userQuery = userQuery.order("desc").startAfter(args.cursor)
        } else {
            userQuery = userQuery.order("desc")
        }

        if (args.limit) {
            userQuery = userQuery.take(args.limit)
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
        let userQuery = ctx.db
            .query("users")
            .withSearchIndex("search_name_email", (q) =>
                q.search("name", args.searchTerm).or(q.search("email", args.searchTerm)),
            )

        if (args.organizationId) {
            userQuery = userQuery.filter((q) => q.eq(q.field("organizationId"), args.organizationId))
        }

        if (args.limit) {
            userQuery = userQuery.take(args.limit)
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
        return await ctx.runMutation(internalCreateOrUpdateUser, {
            clerkId: args.clerkId,
            name: args.name,
            email: args.email,
            role: args.organizationRole || "member",
            organizationId: args.organizationId,
            metadata: {
                userName: args.userName,
                firstName: args.firstName,
                familyName: args.familyName,
                phoneNumber: args.phoneNumber,
                emailVerified: args.emailVerified,
                hasVerifiedContactInfo: args.hasVerifiedContactInfo,
                createdAt: args.createdAt,
                updatedAt: args.updatedAt,
                metadata: args.metadata,
                unsafeMetadata: args.unsafeMetadata,
                privateMetadata: args.privateMetadata,
                organizationName: args.organizationName,
                organizationSlug: args.organizationSlug,
                organizationLogo: args.organizationLogo,
                hasOrgLogo: args.hasOrgLogo,
                organizationPermissions: args.organizationPermissions,
            },
        })
    },
})

