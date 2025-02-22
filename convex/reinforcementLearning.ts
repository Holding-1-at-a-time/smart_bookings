/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 14:42:39
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { action, mutation, query } from "./_generated/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Helper function to update the RL model
async function updateRLModel(ctx: any, organizationId: string, newData: any) {
    const existingModel = await ctx.db
        .query("rlModel")
        .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
        .first()

    if (existingModel) {
        await ctx.db.patch(existingModel._id, {
            policyParams: JSON.stringify(newData.policyParams),
            valueFunction: JSON.stringify(newData.valueFunction),
            environmentModel: JSON.stringify(newData.environmentModel),
            lastUpdated: new Date().toISOString(),
        })
    } else {
        await ctx.db.insert("rlModel", {
            organizationId,
            policyParams: JSON.stringify(newData.policyParams),
            valueFunction: JSON.stringify(newData.valueFunction),
            environmentModel: JSON.stringify(newData.environmentModel),
            lastUpdated: new Date().toISOString(),
        })
    }
}

export const collectFeedback = mutation({
    args: {
        bookingId: v.id("bookings"),
        organizationId: v.id("organizations"),
        userId: v.id("users"),
        rating: v.number(),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { bookingId, organizationId, userId, rating, comment } = args

        await ctx.db.insert("bookingFeedback", {
            bookingId,
            organizationId,
            userId,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        })

        // Add to RL training data
        const booking = await ctx.db.get(bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        await ctx.db.insert("rlTrainingData", {
            organizationId,
            state: JSON.stringify({
                date: booking.date,
                startTime: booking.startTime,
                serviceId: booking.serviceId,
                providerId: booking.providerId,
            }),
            action: "book",
            reward: rating,
            nextState: JSON.stringify({
                date: booking.date,
                startTime: booking.startTime,
                serviceId: booking.serviceId,
                providerId: booking.providerId,
                feedback: rating,
            }),
            createdAt: new Date().toISOString(),
        })

        return true
    },
})

export const trainRLModel = action({
    args: {
        organizationId: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        const { organizationId } = args

        // Fetch training data
        const trainingData = await ctx.runQuery("reinforcementLearning:getTrainingData", { organizationId })

        // Use Grok to train the RL model
        const prompt = `
      Given the following training data for a booking system, update the reinforcement learning model:

      Training Data:
      ${JSON.stringify(trainingData)}

      Current RL Model:
      ${JSON.stringify(await ctx.runQuery("reinforcementLearning:getRLModel", { organizationId }))}

      Provide updated policy parameters, value function, and environment model as a JSON object.
    `

        const { text } = await generateText({
            model: groq("gemma2-9b-it"),
            prompt,
        })

        const updatedModel = JSON.parse(text)

        // Update the RL model in the database
        await updateRLModel(ctx, organizationId, updatedModel)

        return updatedModel
    },
})

export const getRLModel = query({
    args: {
        organizationId: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        const { organizationId } = args

        const model = await ctx.db
            .query("rlModel")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .first()

        if (!model) {
            return null
        }

        return {
            policyParams: JSON.parse(model.policyParams),
            valueFunction: JSON.parse(model.valueFunction),
            environmentModel: JSON.parse(model.environmentModel),
            lastUpdated: model.lastUpdated,
        }
    },
})

export const getTrainingData = query({
    args: {
        organizationId: v.id("organizations"),
    },
    handler: async (ctx, args) => {
        const { organizationId } = args

        const trainingData = await ctx.db
            .query("rlTrainingData")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .collect()

        return trainingData.map((data) => ({
            ...data,
            state: JSON.parse(data.state),
            nextState: JSON.parse(data.nextState),
        }))
    },
})

