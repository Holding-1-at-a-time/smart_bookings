/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 14:32:09
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getProviderAvailability } from "./availability";
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";


export const updateProviderAvailability = mutation({
    args: {
        providerId: v.id("users"),
        organizationId: v.id("organizations"),
        availabilitySlots: v.array(
            v.object({
                dayOfWeek: v.number(),
                startTime: v.string(),
                endTime: v.string(),
                isRecurring: v.boolean(),
                date: v.optional(v.string()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const { providerId, organizationId, availabilitySlots } = args

        // Delete existing availability for the provider
        await ctx.db
            .query("availability")
            .withIndex("by_provider", (q) => q.eq("providerId", providerId))
            .delete()

        // Insert new availability slots
        for (const slot of availabilitySlots) {
            await ctx.db.insert("availability", {
                providerId,
                organizationId,
            })
        }

        return true
    },
})

export const getProviderAvailability = query({
    args: {
        providerId: v.id("users"),
        organizationId: v.id("organizations"),
        date: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { providerId, organizationId, date } = args

        let availabilityQuery = ctx.db
            .query("availability")
            .withIndex("by_provider", (q) => q.eq("providerId", providerId))
            .filter((q) => q.eq(q.field("organizationId"), organizationId))

        if (date) {
            const dayOfWeek = new Date(date).getDay()
            availabilityQuery = availabilityQuery.filter((q) =>
                q.or(
                    q.and(q.eq(q.field("isRecurring"), true), q.eq(q.field("dayOfWeek"), dayOfWeek)),
                    q.and(q.eq(q.field("isRecurring"), false), q.eq(q.field("date"), date)),
                ),
            )
        }

        return await availabilityQuery.collect()
    },
})

export const checkAvailability = action({
    args: {
        providerId: v.id("users"),
        organizationId: v.id("organizations"),
        date: v.string(),
        startTime: v.string(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const { providerId, organizationId, date, startTime, duration } = args

        // Fetch provider's availability
        const availability = await ctx.runQuery("availability:getProviderAvailability", {
            providerId,
            organizationId,
            date,
        })

        // Fetch existing bookings
        const bookings = await ctx.runQuery("bookings:getProviderBookings", {
            providerId,
            organizationId,
            date,
        })

        // Fetch RL model
        const rlModel = await ctx.runQuery("reinforcementLearning:getRLModel", { organizationId })

        // Use Grok to analyze availability and bookings, incorporating the RL model
        const prompt = `
      Given the following availability, bookings, and RL model for a service provider, determine if the requested time slot is available:

      Provider Availability:
      ${JSON.stringify(availability)}

      Existing Bookings:
      ${JSON.stringify(bookings)}

      RL Model:
      ${JSON.stringify(rlModel)}

      Requested Booking:
      Date: ${date}
      Start Time: ${startTime}
      Duration: ${duration} minutes

      Provide a JSON object with the following properties:
      - isAvailable: boolean
      - explanation: string
      - confidenceScore: number
      `;
        const { text } = await generateText({
            model: groq("gemma2-9b-it"),
            prompt: prompt,
        });

        // Split the generated text by newlines, trim empty parts, and validate format
        const parts = text.split("\n").map(part => part.trim()).filter(Boolean);
        if (parts.length < 3) {
            throw new Error(`Unexpected response format from RL model. Expected at least 3 parts but got ${parts.length}. Response: ${text}`);
        }

        const [availabilityResult, explanation, confidenceScoreStr] = parts;
        const confidence = parseFloat(confidenceScoreStr);
        if (isNaN(confidence) || confidence < 0 || confidence > 1) {
            throw new Error(`Invalid confidence score received from RL model: "${confidenceScoreStr}".`);
        }

        const isAvailable = availabilityResult.toLowerCase() === "available";


        return {
            isAvailable,
            explanation: explanation.trim(),
            confidenceScore: Number.parseFloat(confidenceScore),
        };
    },
});