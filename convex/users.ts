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
import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"


/**
 * Internal mutation to delete a user and their sessions.
 */
export const internalDeleteUser = internalMutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        console.log("internalDeleteUser", args)
        const { userId } = args

        // Delete user's sessions
        const sessions = await ctx.db
            .query("userSessions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect()

        for (const session of sessions) {
            await ctx.db.delete(session._id)
        }

        // Delete the user
        await ctx.db.delete(userId)
    },
})

/**
 * Public mutation to create or update a user.
 */
export const createOrUpdateUser = mutation({
    args: {
        clerkId: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        console.log("createOrUpdateUser", args)
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique()

        if (existingUser) {
            // Update the existing user
            await ctx.db.patch(existingUser._id, {
                metadata: args.metadata || existingUser.metadata,
                })
        return await ctx.db.insert("users", args)
    },
})
/**
 * Public mutation to delete a user.
 */
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

/**
 * Public mutation to update a user's role.
 */
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

/**
 * Public mutation to update a user's organization.
 */
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

/**
 * Query to get a user by their ID.
 */
export const getUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        console.log("getUser", args)
        return await ctx.db.get(args.userId)
    },
})

/**
 * Query to get a user by their Clerk ID.
 */
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

/**
 * Query to list users, optionally filtered by organization.
 */
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

/**
 * Query to search users by name or email, optionally filtered by organization.
 */
/**
 * Query to search users by name or email, optionally filtered by organization.
 *
 * @param ctx The Convex context
 * @param args The query arguments
 * @param args.searchTerm The search term to query
 * @param args.organizationId The ID of the organization to filter by, if any
 * @param args.limit The maximum number of results to return, if any
 * @returns An array of users matching the query
 */
/**
 * Searches for users based on the provided search term, organization ID, and limit.
 *
 * @param {string} searchTerm - The term to search for in the users' names and emails.
 * @param {string} [organizationId] - The ID of the organization to filter by.
 * @param {number} [limit] - The maximum number of results to return.
 * @returns {Promise<User[]>} A promise that resolves to an array of users that match the search criteria.
 */
/**
 * Searches for users based on the provided search term, organization ID, and limit.
 *
 * @param {SearchUsersArgs} args - The search arguments.
 * @returns {Promise<User[]>} A promise that resolves to an array of users that match the search criteria.
 */
export const searchUsers = query({
    args: {
        searchTerm: v.string(),
        organizationId: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.type(User)),
    handler: async (ctx, args) => {
        try {
            const { searchTerm, organizationId, limit } = args;

            if (!searchTerm) {
              throw new Error("Search term is required");
            }

        const userQuery = ctx.db
            .query<users>("user")
            .withIndex("search_name_email", (q) => q.eq(searchTerm, {}));

            if (organizationId) {
                userQuery.filter((q) => q.field("organizationId").eq(organizationId));
            }

            if (limit) {
                userQuery.take(limit);
            }

            return await userQuery.collect();
        } catch (error) {
            console.error("Error searching users:", error);
            throw new Error("Failed to search users");
        }
    },
});

export interface SearchUsersArgs {
    searchTerm: string;
    organizationId?: string;
    limit?: number;
}

/**
 * Mutation to store a user's session information.
 */
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

        return await ctx.db.insert("users", {
            clerkId,
            name,
            email,
            role: organizationRole || "member",
            organizationId,
            metadata: metadataFields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
    },
})

