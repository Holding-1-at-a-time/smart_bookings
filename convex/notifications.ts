/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:23:35
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const sendEmailNotification = mutation({
  args: {
    organizationId: v.id("organizations"),
    recipientEmail: v.string(),
    templateId: v.id("notificationTemplates"),
    data: v.object(v.any()),
  },
  handler: async (ctx, args) => {
    const { organizationId, recipientEmail, templateId, data } = args

    try {
      const template = await ctx.db.get(templateId)
      if (!template || template.organizationId !== organizationId) {
        throw new Error("Notification template not found or access denied")
      }

      // Assume sendEmail is an external service that sends emails
      await sendEmail(recipientEmail, template.subject, template.body, data)

      await ctx.db.insert("sentNotifications", {
        organizationId,
        recipientEmail,
        templateId,
        sentAt: new Date().toISOString(),
      })

      loggingService.info(`Email notification sent`, { organizationId, recipientEmail, templateId })
      return { success: true }
    } catch (error) {
      loggingService.error(`Error sending email notification: ${error}`, { organizationId, recipientEmail, templateId })
      throw new Error("Failed to send email notification")
    }
  },
})

export const createNotificationTemplate = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, name, subject, body } = args

    try {
      const templateId = await ctx.db.insert("notificationTemplates", {
        organizationId,
        name,
        subject,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      loggingService.info(`Notification template created: ${templateId}`, { organizationId, name })
      return { success: true, templateId }
    } catch (error) {
      loggingService.error(`Error creating notification template: ${error}`, { organizationId, name })
      throw new Error("Failed to create notification template")
    }
  },
})

