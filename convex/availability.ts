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
                ...slot,
                serviceId: slot.serviceId,
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

      Use the RL model to inform your decision. Respond with either "Available" or "Not Available" followed by a brief explanation and a confidence score between 0 and 1.
    `;

        const { text } = await generateText({
            model: groq("gemma2-9b-it"),
            prompt,
        });

        const [availabilityResult, explanation, confidenceScore] = text.split("\n");
        const isAvailable = availabilityResult.toLowerCase().trim() === "available";

        return {
            isAvailable,
            explanation: explanation.trim(),
            confidenceScore: Number.parseFloat(confidenceScore),
        };
    },
});