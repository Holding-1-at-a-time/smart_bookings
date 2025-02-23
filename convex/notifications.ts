/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 17:26:42
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { sendEmail } from "../lib/gmail-api"

export const getSettings = query({
    args: { organizationId: v.string() },
    handler: async (ctx, args) => {
        const settings = await ctx.db
            .query("notificationSettings")
            .filter((q) => q.eq(q.field("organizationId"), args.organizationId))
            .first()

        return (
            settings || {
                emailNotifications: true,
                smsNotifications: false,
                reminderFrequency: "1day",
            }
        )
    },
})

export const updateSettings = mutation({
    args: {
        organizationId: v.string(),
        emailNotifications: v.optional(v.boolean()),
        smsNotifications: v.optional(v.boolean()),
        reminderFrequency: v.optional(v.union(v.literal("1day"), v.literal("2days"), v.literal("1week"))),
    },
    handler: async (ctx, args) => {
        const { organizationId, ...settings } = args

        const existingSettings = await ctx.db
            .query("notificationSettings")
            .filter((q) => q.eq(q.field("organizationId"), organizationId))
            .first()

        if (existingSettings) {
            await ctx.db.patch(existingSettings._id, settings)
        } else {
            await ctx.db.insert("notificationSettings", { organizationId, ...settings })
        }

        return { success: true }
    },
})

export const sendNotificationEmail = mutation({
    args: {
        organizationId: v.string(),
        to: v.string(),
        subject: v.string(),
        templateType: v.union(v.literal("confirmation"), v.literal("reminder")),
        templateData: v.object({
            customerName: v.string(),
            serviceName: v.string(),
            date: v.string(),
            time: v.string(),
            businessName: v.string(),
            businessAddress: v.string(),
            businessPhone: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const { organizationId, ...emailData } = args

        const settings = await ctx.db
            .query("notificationSettings")
            .filter((q) => q.eq(q.field("organizationId"), organizationId))
            .first()

        if (settings?.emailNotifications) {
            await sendEmail(emailData)
            return { success: true }
        } else {
            return { success: false, reason: "Email notifications are disabled" }
        }
    },
})

