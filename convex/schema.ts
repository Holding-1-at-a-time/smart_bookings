/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:45:18
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    ownerId: v.string(),
    settings: v.object({
      timezone: v.string(),
      currency: v.string(),
      locale: v.string(),
    }),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    businessHours: v.string(),
    website: v.string(),
    logo: v.optional(v.string()),
    slug: v.string(),
    createdAt: v.string(),
  })
    .index("by_address", ["address"])
    .index("by_phone", ["phone"])
    .index("by_email", ["email"])
    .index("by_website", ["website"])
    .index("by_logo", ["logo"]),

  users: defineTable({
    organizationId: v.id("organizations"),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    metadata: v.optional(v.any()),
    updatedAt: v.string(),
    userSessions: v.array(v.object({
      token: v.string(),
      refreshToken: v.string(),
    })),
    sessions: v.array(v.object({
      token: v.string(),
      createdAt: v.string(),
      updatedAt: v.string(),
      refreshToken: v.string(),
    }))
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_organization_and_role", ["organizationId", "role"]),

  serviceCategories: defineTable({
    id: v.id("serviceCategories"),
    organizationId: v.id("organizations"),
    category: v.array(v.object({
      id: v.id("serviceCategories"),
      name: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
      isActive: v.boolean(),
    })),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_organization", ["organizationId"])
    .index("by_name", ["name"])
    .index("by_order", ["order"])
    .index("by_organization_and_name", ["organizationId", "name"])
    .index("by_organization_and_order", ["organizationId", "order"]),

  services: defineTable({
    organizationId: v.id("organizations"),
    categoryId: v.optional(v.id("serviceCategories")),
    name: v.string(),
    description: v.string(),
    duration: v.number(),
    price: v.number(),
    isActive: v.boolean(),
    features: v.array(v.string()),
    images: v.optional(v.array(v.string())),
    maxBookingsPerDay: v.optional(v.number()),
    preparationTime: v.optional(v.number()),
    cleanupTime: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_category", ["categoryId"])
    .index("by_name", ["name"])
    .index("by_duration", ["duration"])
    .index("by_price", ["price"])
    .index("by isActive", ["isActive"]),

  availability: defineTable({
    organizationId: v.id("organizations"),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
  }).index("by_organization", ["organizationId"])
    .index("by_day_of_week", ["dayOfWeek"])
    .index("by_start_time", ["startTime"])
    .index("by_end_time", ["endTime"])
    .index("by_organization_and_day_of_week", ["organizationId", "dayOfWeek"]),

  bookings: defineTable({
    organizationId: v.id("organizations"),
    serviceId: v.id("services"),
    userId: v.id("users"),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    status: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    notes: v.optional(v.string()),
    totalPrice: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_service", ["serviceId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_customer_name", ["customerName"])
    .index("by_customer_email", ["customerEmail"])
    .index("by_customer_phone", ["customerPhone"]),

  organizationData: defineTable({
    organizationId: v.id("organizations"),
    key: v.string(),
    value: v.string(),
    createdAt: v.string(),
  })
    .index("by_key", ["key"])
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_key", ["organizationId", "key"])
    .index("by_organization_and_value", ["organizationId", "value"])
    .index("by_organization_and_key_and_value", ["organizationId", "key", "value"]),

  customerFeedback: defineTable({
    organizationId: v.id("organizations"),
    bookingId: v.id("bookings"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_booking", ["bookingId"])
    .index("by_rating", ["rating"]),
})