/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:19:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { mutation } from "./_generated/server"
import { v } from "convex/values"

// This is a placeholder function. In a real-world scenario, you would integrate with an email service provider.
async function sendEmail(to: string, subject: string, body: string) {
    console.log(`Sending email to ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)
    // Implement actual email sending logic here
}

export const sendBookingConfirmation = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, args) => {
        const booking = await ctx.db.get(args.bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        const customer = await ctx.db.get(booking.customerId)
        if (!customer) {
            throw new Error("Customer not found")
        }

        const organization = await ctx.db.get(booking.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        const service = await ctx.db.get(booking.serviceId)
        if (!service) {
            throw new Error("Service not found")
        }

        const subject = `Booking Confirmation - ${organization.name}`
        const body = `
      Dear ${customer.name},

      Your booking has been confirmed for ${service.name} on ${booking.date} at ${booking.startTime}.

      Thank you for choosing ${organization.name}.

      Best regards,
      ${organization.name} Team
    `

        await sendEmail(customer.email, subject, body)

        return true
    },
})

export const sendBookingReminder = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, args) => {
        const booking = await ctx.db.get(args.bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        const customer = await ctx.db.get(booking.customerId)
        if (!customer) {
            throw new Error("Customer not found")
        }

        const organization = await ctx.db.get(booking.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        const service = await ctx.db.get(booking.serviceId)
        if (!service) {
            throw new Error("Service not found")
        }

        const subject = `Booking Reminder - ${organization.name}`
        const body = `
      Dear ${customer.name},

      This is a reminder for your upcoming booking for ${service.name} on ${booking.date} at ${booking.startTime}.

      We look forward to seeing you soon.

      Best regards,
      ${organization.name} Team
    `

        await sendEmail(customer.email, subject, body)

        return true
    },
})

