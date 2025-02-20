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
    }),
  }).index("by_owner", ["ownerId"]),

  users: defineTable({
    organizationId: v.id("organizations"),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.string(),
    metadata: v.optional(v.any()),
    updatedAt: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_organization", ["organizationId"]),

  serviceCategories: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_organization", ["organizationId"]),

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
    .index("by_category", ["categoryId"]),

  availability: defineTable({
    organizationId: v.id("organizations"),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
  }).index("by_organization", ["organizationId"]),

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
    .index("by_date", ["date"]),

  organizationData: defineTable({
    organizationId: v.id("organizations"),
    key: v.string(),
    value: v.string(),
    createdAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_key", ["organizationId", "key"]),
})

