/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 25/02/2025 - 19:49:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import {mutation, query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const getUserRole = query({
    args: { userId: v.string(), orgId: v.string() },
    handler: async (ctx, args) => {
        const { userId, orgId } = args

        // Query the user's role from the database
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
            .first()

        if (!user) {
            return null
        }

        // Query the user's role in the organization
        const orgMembership = await ctx.db
            .query("organizationMembers")
            .withIndex("by_user_and_org", (q) => q.eq("userId", user._id).eq("organizationId", orgId))
            .first()

        return orgMembership?.role || null
    },
})

export const updateUserInfo = query({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string(),
        orgId: v.optional(v.string()),
        orgPermissions: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const { userId, email, name, orgId, orgPermissions } = args

        // Update or create user
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
            .first()

        if (existingUser) {
            await ctx.db.patch(existingUser._id, { email, name })
        } else {
            await ctx.db.insert("users", { clerkId: userId, email, name })
        }

        // Update organization membership if orgId is provided
        if (orgId) {
            const existingMembership = await ctx.db
                .query("organizationMembers")
                .withIndex("by_user_and_org", (q) => q.eq("userId", existingUser?._id).eq("organizationId", orgId))
                .first()

            if (existingMembership) {
                await ctx.db.patch(existingMembership._id, { permissions: orgPermissions })
            } else {
                await ctx.db.insert("organizationMembers", {
                    userId: existingUser?._id,
                    organizationId: orgId,
                    role: "member", // Default role
                    permissions: orgPermissions,
                })
            }
        }

        return { success: true }
    },
})

export const updateUserRole = mutation({
    args: { userId: v.string(), organizationId: v.string(), newRole: v.string() },
    handler: async (ctx, args) => {
        const { userId, organizationId, newRole } = args

        try {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
                .first()

            if (!user) {
                throw new Error("User not found")
            }

            const orgMembership = await ctx.db
                .query("organizationMembers")
                .withIndex("by_user_and_org", (q) => q.eq("userId", user._id).eq("organizationId", organizationId))
                .first()

            if (!orgMembership) {
                throw new Error("User is not a member of this organization")
            }

            await ctx.db.patch(orgMembership._id, { role: newRole })

            loggingService.info(`User role updated`, { userId, organizationId, newRole })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error updating user role: ${error}`, { userId, organizationId, newRole })
            throw new Error("Failed to update user role")
        }
    },
})

export const createInvitation = mutation({
    args: { organizationId: v.string(), email: v.string(), role: v.string() },
    handler: async (ctx, args) => {
        const { organizationId, email, role } = args

        try {
            const existingInvitation = await ctx.db
                .query("invitations")
                .withIndex("by_org_and_email", (q) => q.eq("organizationId", organizationId).eq("email", email))
                .first()

            if (existingInvitation) {
                throw new Error("An invitation for this email already exists")
            }

            const invitationId = await ctx.db.insert("invitations", {
                organizationId,
                email,
                role,
                status: "pending",
                createdAt: new Date().toISOString(),
            })

            loggingService.info(`Invitation created`, { organizationId, email, role })
            return { success: true, invitationId }
        } catch (error) {
            loggingService.error(`Error creating invitation: ${error}`, { organizationId, email, role })
            throw new Error("Failed to create invitation")
        }
    },
})

export const acceptInvitation = mutation({
    args: { invitationId: v.id("invitations"), userId: v.string() },
    handler: async (ctx, args) => {
        const { invitationId, userId } = args

        try {
            const invitation = await ctx.db.get(invitationId)

            if (!invitation || invitation.status !== "pending") {
                throw new Error("Invalid or expired invitation")
            }

            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
                .first()

            if (!user) {
                throw new Error("User not found")
            }

            await ctx.db.insert("organizationMembers", {
                userId: user._id,
                organizationId: invitation.organizationId,
                role: invitation.role,
                joinedAt: new Date().toISOString(),
            })

            await ctx.db.patch(invitationId, { status: "accepted" })

            loggingService.info(`Invitation accepted`, { invitationId, userId })
            return { success: true }
        } catch (error) {
            loggingService.error(`Error accepting invitation: ${error}`, { invitationId, userId })
            throw new Error("Failed to accept invitation")
        }
    },
})

