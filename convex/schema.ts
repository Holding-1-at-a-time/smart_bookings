/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:23:08
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    Id: v.id("organizations"),
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
    metaData: v.string(),
    upDatedAt: v.string(),
  }).index("by_user_id", ["clerkId"])
    .index("by_organization", ["organizationId"]),

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
  }).index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_time", ["startTime", "endTime"]),

  organizationData: defineTable({
    organizationId: v.string(),
    value: v.string(),
    createdAt: v.string(),
  }).index("by_organization", ["organizationId"]),
});