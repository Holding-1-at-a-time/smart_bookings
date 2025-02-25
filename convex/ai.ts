/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:23:58
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"
import { generateText } from "ai"
import { ollama } from 'ollama-ai-provider';

export const generateChatbotResponse = mutation({
    args: {
        organizationId: v.id("organizations"),
        userMessage: v.string(),
        chatHistory: v.array(v.object({ role: v.string(), content: v.string() })),
    },
    handler: async (ctx, args) => {
        const { organizationId, userMessage, chatHistory } = args

        try {
            const organization = await ctx.db.get(organizationId)
            if (!organization) {
                throw new Error("Organization not found")
            }

            const services = await ctx.db
                .query("services")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect()

            const prompt = `You are an AI assistant for ${organization.name}, an auto detailing business. 
                      Respond to the following message based on the chat history and available services:
                      Available services: ${JSON.stringify(services)}
                      User message: ${userMessage}`

            const { text } = await generateText({
                model: ollama("llama3.1: 8b"),
                prompt: prompt,
                messages: chatHistory.map((message) => ({
                    role: "user", // Set the role to "user"
                    content: message.content,
                })),
            })

            loggingService.info(`Chatbot response generated`, { organizationId })
            return { response: text }
        } catch (error) {
            loggingService.error(`Error generating chatbot response: ${error}`, { organizationId, userMessage })
            throw new Error("Failed to generate chatbot response")
        }
    },
})

export const suggestBookingSlots = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, date } = args

        try {
            const service = await ctx.db.get(serviceId)
            if (!service || service.organizationId !== organizationId) {
                throw new Error("Service not found or access denied")
            }

            const existingBookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) => q.eq("organizationId", organizationId).eq("date", date))
                .collect();

            const businessHours = await ctx.db
                .query("businessHours")
                .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
                .collect();

            if (!businessHours) {
                throw new Error("Business hours not set")
            }

            const prompt = `Given the following data:
                      Service duration: ${service.duration} minutes
                      Existing bookings: ${JSON.stringify(existingBookings)}
                      Business hours: ${JSON.stringify(businessHours)}
                      Suggest 5 optimal booking slots for the date ${date}.`

            const { text } = await generateText({
                model: ollama("llama3.1: 8b"),
                prompt: prompt,
            })

            let suggestedSlots;
            try {
                suggestedSlots = JSON.parse(text)
            } catch (parseError) {
                loggingService.error("Failed to parse booking slots JSON", { error: parseError, organizationId, serviceId, date });
                throw new Error("Failed to parse booking slots response");
            }

            loggingService.info(`Booking slots suggested`, { organizationId, serviceId, date })
            return suggestedSlots
        } catch (error) {
            loggingService.error(`Error suggesting booking slots: ${error}`, { organizationId, serviceId, date })
            throw new Error("Failed to suggest booking slots")
        }
    },
})

