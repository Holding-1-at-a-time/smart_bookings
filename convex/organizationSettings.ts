/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:17:35
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getOrganizationSettings = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const organization = await ctx.db.get(args.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }
        return organization
    },
})

export const updateOrganizationSettings = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.optional(v.string()),
        settings: v.optional(
            v.object({
                timezone: v.optional(v.string()),
                currency: v.optional(v.string()),
                locale: v.optional(v.string()),
            }),
        ),
        address: v.optional(v.string()),
        phone: v.optional(v.string()),
        email: v.optional(v.string()),
        website: v.optional(v.string()),
        logo: v.optional(v.string()),
        brandColor: v.optional(v.string()),
        description: v.optional(v.string()),
        socialMedia: v.optional(
            v.object({
                facebook: v.optional(v.string()),
                twitter: v.optional(v.string()),
                instagram: v.optional(v.string()),
                linkedin: v.optional(v.string()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { organizationId, ...updates } = args
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        const updatedOrganization = {
            ...organization,
            ...updates,
            settings: {
                ...organization.settings,
                ...updates.settings,
            },
            socialMedia: {
                ...organization.socialMedia,
                ...updates.socialMedia,
            },
        }

        await ctx.db.replace(organizationId, updatedOrganization)
        return updatedOrganization
    },
})

export const updateBusinessHours = mutation({
    args: {
        organizationId: v.id("organizations"),
        businessHours: v.array(
            v.object({
                dayOfWeek: v.number(),
                start: v.string(),
                end: v.string(),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { organizationId, businessHours } = args
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        await ctx.db.patch(organizationId, { businessHours })
        return businessHours
    },
})

export const updateHolidays = mutation({
    args: {
        organizationId: v.id("organizations"),
        holidays: v.array(
            v.object({
                date: v.string(),
                name: v.string(),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { organizationId, holidays } = args
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        await ctx.db.patch(organizationId, { holidays })
        return holidays
    },
})



export const getBusinessHours = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const organization = await ctx.db.get(args.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }
        return organization.businessHours
    },
})

export const updateBusinessHours = mutation({
    args: {
        organizationId: v.id("organizations"),
        businessHours: v.array(
            v.object({
                dayOfWeek: v.number(),
                start: v.string(),
                end: v.string(),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { organizationId, businessHours } = args
        await ctx.db.patch(organizationId, { businessHours })
        return true
    },
})

export const getHolidays = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        const organization = await ctx.db.get(args.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }
        return organization.holidays
    },
})

export const addHoliday = mutation({
    args: {
        organizationId: v.id("organizations"),
        date: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, date, name } = args
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }
        const holidays = [...organization.holidays, { date, name }]
        await ctx.db.patch(organizationId, { holidays })
        return true
    },
})

export const removeHoliday = mutation({
    args: {
        organizationId: v.id("organizations"),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, date } = args
        const organization = await ctx.db.get(organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }
        const holidays = organization.holidays.filter((holiday) => holiday.date !== date)
        await ctx.db.patch(organizationId, { holidays })
        return true
    },
})

