/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 21:47:46
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

export const processPayment = mutation({
    args: {
        organizationId: v.id("organizations"),
        amount: v.number(),
        cardToken: v.string(),
        bookingId: v.id("bookings"),
    },
    handler: async (ctx, args) => {
        const { organizationId, amount, cardToken, bookingId } = args

        try {
            // Implement payment processing logic here (e.g., using Stripe)
            // For now, we'll simulate a successful payment
            const paymentId = `mock_payment_${Date.now()}`

            await ctx.db.patch(bookingId, { paymentStatus: "paid", paymentId })

            loggingService.info(`Payment processed`, { organizationId, bookingId, amount })
            return { success: true, paymentId }
        } catch (error) {
            loggingService.error(`Error processing payment: ${error}`, { organizationId, bookingId, amount })
            throw new Error("Failed to process payment")
        }
    },
})

