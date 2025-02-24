/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:19:28
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { addMinutes } from "date-fns"

export const getBookingsByDate = query({
    args: { organizationId: v.id("organizations"), date: v.string() },
    /**
     * Handler to get staff by organization
     * @param {object} ctx - The context object
     * @param {object} args - The arguments object
     * @param {Id<"organizations">} args.organizationId - The ID of the organization
     * @returns {Promise<any[]>} - Promise resolving to an array of staff
     */
    handler: async (ctx: any, args: { organizationId: Id<"organizations"> }): Promise<any[]> => {
        return await ctx.db
                    .query("staff")
                    .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
                    .collect();
    },
})

export const getAvailableTimeSlots = query({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, serviceId, date } = args

        const organization = await ctx.db.get(args.organizationId)
        if (!organization) {
            throw new Error("Organization not found")
        }

        const service = await ctx.db.get(serviceId)
        if (!service) {
            throw new Error("Service not found")
        }

        const {businessHours} = organization
            .query("staff")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .collect()

        const {businessHours} = organization
        const bookingDay = new Date(date).getDay()
        const { businessHours } = organization

        if (!dayHours) {
            return [] // No available slots on this day
        }

        const isHoliday = organization.holidays.some((holiday) => holiday.date === date)
        if (isHoliday) {
            return [] // No available slots on holidays
        }

        const existingBookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization_and_date", (q) => q.eq("organizationId", organizationId).eq("date", date))
            .collect()

        const availableSlots = generateTimeSlots(
            dayHours.start,
            dayHours.end,
            service.duration,
            staff,
            existingBookings,
            date,
        )

        return availableSlots
    },
})

export const createBooking = mutation({
  args: {
    organizationId: v.id("organizations"),
    serviceId: v.id("services"),
    staffId: v.id("staff"),
    customerId: v.id("customers"),
    date: v.string(),
    startTime: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, serviceId, staffId, customerId, date, startTime } = args

    return await ctx.db.transaction(async (tx) => {
      const service = await tx.get(serviceId)
      if (!service) {
        throw new Error("Service not found")
      }

      const endTime = addMinutes(startTime, service.duration)

      // Check for conflicts
      const existingBookings = await tx
        .query("bookings")
        .withIndex("by_organization_and_date", (q) => q.eq("organizationId", organizationId).eq("date", date))
        .filter((q) => q.eq(q.field("staffId"), staffId))
        .collect()

      const hasConflict = existingBookings.some((booking) => {
        return (
          (startTime >= booking.startTime && startTime < booking.endTime) ||
          (endTime > booking.startTime && endTime <= booking.endTime) ||
          (startTime <= booking.startTime && endTime >= booking.endTime)
        )
      })

      if (hasConflict) {
        throw new Error("Booking conflict detected")
      }

      // Create the booking
      const newBooking = await tx.insert("bookings", {
        organizationId,
        serviceId,
        staffId,
        customerId,
        date,
        startTime,
        endTime,
        status: "confirmed",
        notes: "",
      })

      return newBooking
    })
  },
})



export const cancelBooking = mutation({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, args) => {
        const booking = await ctx.db.get(args.bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        await ctx.db.patch(args.bookingId, { status: "cancelled" })
        return true
    },
})

function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number)
    const date = new Date(0, 0, 0, hours, mins)
    date.setMinutes(date.getMinutes() + minutes)
    return date.toTimeString().slice(0, 5)
}

function generateTimeSlots(
    businessStart: string,
    businessEnd: string,
    serviceDuration: number,
    staff: any[],
    existingBookings: any[],
    date: string,
): { startTime: string; staffId: Id<"staff"> }[] {
    const slots: { startTime: string; staffId: Id<"staff"> }[] = []
    const startTime = parseTime(businessStart)
    const endTime = parseTime(businessEnd)

    for (let time = startTime; time + serviceDuration <= endTime; time += 30) {
        const slotStart = formatTime(time)
        const slotEnd = formatTime(time + serviceDuration)

        for (const staffMember of staff) {
            const isAvailable =
                isStaffAvailable(staffMember, date, slotStart, slotEnd) &&
                !hasConflict(existingBookings, staffMember._id, slotStart, slotEnd)

            if (isAvailable) {
                slots.push({ startTime: slotStart, staffId: staffMember._id })
                break // Move to the next time slot once we find an available staff member
            }
        }
    }

    return slots
}

function parseTime(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

function isStaffAvailable(staff: any, date: string, start: string, end: string): boolean {
    const dayOfWeek = new Date(date).getDay()
    const availability = staff.availability.find((a: any) => a.dayOfWeek === dayOfWeek)
    if (!availability) return false

    return start >= availability.start && end <= availability.end
}

function hasConflict(bookings: any[], staffId: Id<"staff">, start: string, end: string): boolean {
    return bookings.some((booking) => {
        if (booking.staffId !== staffId) return false
        return (
            (start >= booking.startTime && start < booking.endTime) ||
            (end > booking.startTime && end <= booking.endTime) ||
            (start <= booking.startTime && end >= booking.endTime)
        )
    })
}

export const getFilteredBookings = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate, status } = args

        let bookingsQuery = ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("date"), startDate))
            .filter((q) => q.lte(q.field("date"), endDate))

        if (status) {
            bookingsQuery = bookingsQuery.filter((q) => q.eq(q.field("status"), status))
        }

        return await bookingsQuery.collect()
    },
})

export const getBookings = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("date"), startDate))
            .filter((q) => q.lte(q.field("date"), endDate))
            .collect()

        return bookings
    },
})

export const updateBookingStatus = mutation({
    args: {
        bookingId: v.id("bookings"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const { bookingId, status } = args

        const booking = await ctx.db.get(bookingId)
        if (!booking) {
            throw new Error("Booking not found")
        }

        await ctx.db.patch(bookingId, { status })

        // TODO: Send notification to customer and staff about the status change

        return true
    },
})

export const getBookingStats = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
            .filter((q) => q.gte(q.field("date"), startDate))
            .filter((q) => q.lte(q.field("date"), endDate))
            .collect()

        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
        const statusCounts = bookings.reduce(
            (counts, booking) => {
                counts[booking.status] = (counts[booking.status] || 0) + 1
                return counts
            },
            {} as Record<string, number>,
        )

        return {
            totalBookings,
            totalRevenue,
            statusCounts,
        }
    },
})

