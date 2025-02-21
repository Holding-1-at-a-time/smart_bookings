/**
 * @description      : This module handles user operations including creating, updating, and querying users.
 * @author           : rrome
 * @group            : 
 * @created          : 20/02/2025 - 00:32:02
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/02/2025
 * - Author          : rrome
 * - Modification    : 
 **/

import { Mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { GenericId } from "./_generated/server";
import { v } from "convex/values";

/**
 * Public mutation to create or update a user.
 */
export const createOrUpdateUser = mutation({
    args: {
        clerkId: v.string(),
        metadata: v.optional(v.object()),
        organizationId: v.optional(v.id("organizations")),
        name: v.string(),
        email: v.string(),
        role: v.string(),
        updatedAt: v.string(),
    },
    handler: async(ctx, args: CreateOrUpdateUser Args): Promise<CreateOrUpdateUser Result> => {
    try {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            const updatedUser = await ctx.db.patch(existingUser._id, {
                metadata: args.metadata,
                organizationId: args.organizationId,
                name: args.name,
                email: args.email,
                role: args.role,
                updatedAt: new Date().toISOString(),

            });
            return { user: updatedUser };
        }

        const newUser = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            metadata: args.metadata,
            organizationId: args.organizationId,
            name: args.name,
            email: args.email,
            role: args.role,
            updatedAt: args.updatedAt,
        });
        return { user: newUser };
    } catch (error) {
        if (error instanceof Error) {
            throw error(error.message);
        }
        throw error("Failed to create or update user");
    }
},
});
/**
 * Query to search users by name or email, optionally filtered by organization.
 */
export const searchUsers = query({
    args: {
        searchTerm: v.string(),
        organizationId: v.optional(v.id("organizations")),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.type(User)),
    handler: async (ctx, args) => {
        const { searchTerm, organizationId, limit } = args;

        if (!searchTerm) {
            throw new Error("Search term is required");
        }

        let userQuery = ctx.db.query("users").withIndex("search_name_email", q => q.eq("name", searchTerm).or(q.eq("email", searchTerm)));

        if (organizationId) {
            userQuery = userQuery.filter(q => q.eq("organizationId", organizationId));
        }

        if (limit) {
            userQuery = userQuery.take(limit);
        }

        return await userQuery.collect();
    },
});

export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        console.log("deleteUser", args)
        const user = await ctx.db.get(args.userId)
        if (!user) {
            throw new Error("User not found")
        }
        await ctx.db.delete(args.userId)
        return true
    },
})

export const updateUserRole = mutation({
    args: { userId: v.id("users"), newRole: v.string() },
    handler: async (ctx, args) => {
        console.log("updateUserRole", args)
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
        console.log("updateUserOrganization", args)
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

export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        console.log("getUser", args)
        return await ctx.db.get(args.userId)
    },
})

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        console.log("getUserByClerkId", args)
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
        const { organizationId, limit } = args
        const userQuery = ctx.db.query("users")

        if (organizationId) {
            userQuery.withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
        }

        userQuery.order("desc")

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

export const searchUsers = query<{
    searchTerm: string;
    organizationId?: string;
    limit?: number;
}, User[]>({
    handler: async (ctx, { searchTerm, organizationId, limit }) => {
        if (!searchTerm) {
            throw new Error("Search term is required");
        }

        let userQuery = ctx.db.query("users").withIndex("search_name_email", q => q.eq("name", searchTerm).or(q.eq("email", searchTerm)));

        if (organizationId) {
            userQuery.filter(q => q.eq("organizationId", organizationId));
        }

        if (limit) {
            userQuery.take(limit);
        }
        return await userQuery.collect();
    }
}
)
export const storeUserSession = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        userName: v.optional(v.string),
        firstName: v.string(),
        familyName: v.string(),
        phoneNumber: v.optional(v.string),
        emailVerified: v.boolean(),
        hasVerifiedContactInfo: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
        metadata: v.any(),
        unsafeMetadata: v.any(),
        privateMetadata: v.any(),
        organizationId: v.optional(v.id("organizations")),
        organizationName: v.optional(v.string),
        organizationRole: v.optional(v.string),
        organizationSlug: v.optional(v.string),
        organizationLogo: v.optional(v.string),
        hasOrgLogo: v.optional(v.boolean),
        organizationPermissions: v.optional(v.array(v.string)),
    },
    handler: async (ctx, args) => {
        const { clerkId, name, email, organizationRole, organizationId, ...metadataFields } = args

        return await ctx.db.insert("users", {
            clerkId,
            name,
            email,
            role: organizationRole || "member",
            organizationId: organizationId || null,
            metadata: metadataFields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
    },
})