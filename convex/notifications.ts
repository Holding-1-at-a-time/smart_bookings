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
import { httpAction, mutation } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const createNotificationTemplate = mutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    templateType: v.string(),
    templateContent: v.string(),
    created_at: v.string(),
    createdBy: v.string(),
    sendTo: v.string(),
    templateData: v.string(),
    templateId: v.id("notificationTemplates"),
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
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
        userId: "",
        templateType: "",
        templateContent: "",
        created_at: "",
        createdBy: "",
        sendTo: "",
        templateData: "",
        templateId: templateId,
      })

      loggingService.info(`Notification template created: ${templateId}`, { organizationId, name })
      return { success: true, templateId }
    } catch (error) {
      loggingService.error(`Error creating notification template: ${error}`, { organizationId, name })
      throw new Error("Failed to create notification template")
    }
  },
})

export const sendNotificationEmail = httpAction({
  args: {
    organizationId: v.id("organizations"),
    toUerId: v.id("users"),
    fromUserId: v.id("users"),
    read: v.boolean(),
    templateId: v.id("notificationTemplates"),
    templateData: v.object(v.any()),
    subject: v.string(),
    templateType: v.string(),
  }
}),

const { organizationId, toUerId, fromUserId, read, templateId, templateData, subject, templateType } = args.organizationId;
try {
  const notification = await ctx.db.insert("notifications", {
    organizationId,
    toUserId: toUerId,
    fromUserId,
    templateId,
    templateData,
    subject,
    read,
    templateType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const notification = await ctx.db.insert("notifications", {
    organizationId,
    toUserId: toUerId,
    fromUserId,
    templateId,
    templateData,
    subject,
    read,
    templateType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const template = await ctx.db.get(templateId)
  if (!template) {
    throw new Error("Notification template not found")
  }

  const email = await ctx.http.post("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: `Subject: ${subject}\r\n\r\n${template.body}`,
    }),
  })
  if (!email.ok) {
    const error = await email.json()
    throw new Error(`Error sending email: ${error.error.message}`)
  }

  return { success: true, notification }
} catch (error) {
  loggingService.error(`Error sending notification email: ${error}`, {
    organizationId, toUserId, fromUserId, read, templateId, templateData, subject, templateType
  })
}
export const sendSMSNotificationGoogleChat = httpAction({
  args: {
    organizationId: v.id("organizations"),
    toUserId: v.id("users"),
    fromUserId: v.id("users"),
    templateId: v.id("notificationTemplates"),
    templateData: v.object(v.any()),
    subject: v.string(),
    read: v.boolean(),
    templateType: v.string(),
  },
  async handler(ctx, args) {
    const { organizationId, toUserId, fromUserId, read, templateId, templateData, subject, templateType } = args
    const notification = await ctx.db.insert("notifications", {
      organizationId,
      toUserId,
      fromUserId,
      templateId,
      templateData,
      subject,
      read, templateType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const template = await ctx.db.get(templateId)
    if (!template) {
      return { success: false, error: "Notification template not found" }
    }
    try {
      const notification = await ctx.db.insert("notifications", {
        organizationId, toUserId, fromUserId,
        templateId,
        templateData,
        subject,
        read,
        templateType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const template = await ctx.db.get(templateId)
      if (!template) {
        throw new Error("Notification template not found")
      }

      const toUser = await ctx.db.get(toUserId)
      if (!toUser) {
        throw new Error("User not found")
      }

      const message = await ctx.http.post("https://messages.google.com/v1/messages:send", {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            textBody: template.body,
            recipient: toUser.phoneNumber,
          },
        }),
      })
      if (!message.ok) {
        const error = await message.json()
        throw new Error(`Error sending SMS: ${error.error.message}`)
      }

      return { success: true, notification }
    } catch (error) {
      loggingService.error(`Error sending SMS notification: ${error}`, {
        organizationId, toUserId, fromUserId, read, templateId, templateData, subject, templateType
      })
      throw new Error("Failed to send SMS notification")
    };
  })

// TODO: Implement sendSMS notifications, email notifications, and other types of notifications using Google API's and other services from Google Cloud

async function sendSMSNotification(toPhoneNumber: string, message: string): Promise<void> {
  const response = await fetch("https://messages.google.com/v1/messages:send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        textBody: message,
        recipient: toPhoneNumber,
      },
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error sending SMS: ${error.error.message}`);
  }
}

async function sendEmailNotification(toEmail: string, subject: string, body: string): Promise<void>) {
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: `Subject: ${subject}\r\n\r\n${body}`,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error sending email: ${error.error.message}`);
  }
}
async function sendSMSNotificationUsingGoogleChat(toPhoneNumber: string, message: string): Promise<void> {
  const response = await fetch("https://chat.googleapis.com/v1/spaces/AAAApR7nS0U/messages?key=${process.env.GOOGLE_API_KEY}", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
      thread: {
        space: {
          name: `spaces/${process.env.GOOGLE_CHAT_SPACE_NAME}`,
        },
      },
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error sending SMS using Google Chat: ${error.error.message}`);
  }