/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 22:37:55
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
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
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    userName: v.optional(v.string()),
    firstName: v.string(),
    familyName: v.string(),
    phoneNumber: v.optional(v.string()),
    emailVerified: v.boolean(),
    hasVerifiedContactInfo: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
    metadata: v.any(),
    unsafeMetadata: v.any(),
    privateMetadata: v.any(),
    organizationName: v.optional(v.string()),
    organizationRole: v.optional(v.string()),
    organizationSlug: v.optional(v.string()),
    organizationLogo: v.optional(v.string()),
    hasOrgLogo: v.optional(v.boolean()),
    organizationPermissions: v.optional(v.array(v.string())),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_organization", ["organizationId"])
    .index("by_name_email", ["name", "email"]),

  services: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    duration: v.number(),
    price: v.number(),
  }).index("by_organization", ["organizationId"]),

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
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_time", ["startTime", "endTime"]),

  organizationData: defineTable({
    organizationId: v.id("organizations"),
    key: v.string(),
    value: v.string(),
    createdAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_and_key", ["organizationId", "key"]),
})

